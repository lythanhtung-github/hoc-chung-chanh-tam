/**
 * Member Service
 * @author tbh
 */
const MemberService = (() => {
    const CACHE = {
        2025: null,
        2024: null,
        2023: null,
    };

    /**
     * Map row to Member Obj
     * @param {*} row
     * @returns
     */
    const mapRowToMember = (row) =>
        new Member(
            row[0], // id
            row[1], // fullName
            row[2], // name
            row[3], // position
            row[4], // group
            row[5], // note
            row[6] // image
        );

    /**
     * Load year
     * @param {*} year
     * @returns
     */
    const loadYear = async (year) => {
        if (CACHE[year]) return CACHE[year];

        const rows = await ExcelService.readSheet(String(year));
        if (!rows || rows.length <= 1) return [];

        const members = rows.slice(1).map(mapRowToMember);
        CACHE[year] = members;

        return members;
    };

    /**
     * Get member by year
     * @param {*} year
     * @returns
     */
    const getMembersByYear = (year) => loadYear(year);

    /**
     * Get all years in cache
     *
     * @returns
     */
    const getAllYears = () =>
        Object.keys(CACHE)
            .map(Number)
            .sort((a, b) => b - a);

    return Object.freeze({
        getMembersByYear,
        getAllYears,
    });
})();
