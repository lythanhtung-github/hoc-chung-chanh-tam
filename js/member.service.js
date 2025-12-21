/**
 * MemberService
 * Quản lý dữ liệu thành viên theo năm
 * @author tbh
 */
 const MemberService = (() => {
    const CACHE = {
        2025: null,
        2024: null,
        2023: null,
    };

    const mapRowToMember = (row) =>
        new Member(
            row[0],
            row[1],
            row[2],
            row[3],
            row[4],
            row[5]
        );

    const loadYear = async (year) => {
        if (CACHE[year]) return CACHE[year];

        const rows = await ExcelService.readSheet(String(year));
        if (!rows || rows.length <= 1) return [];

        const members = rows.slice(1).map(mapRowToMember);
        CACHE[year] = members;

        return members;
    };

    const getMembersByYear = (year) => loadYear(year);

    const getAllYears = () =>
        Object.keys(CACHE)
            .map(Number)
            .sort((a, b) => b - a);

    return Object.freeze({
        getMembersByYear,
        getAllYears,
    });
})();