const MemberService = (function() {
    const data = {
        2025: [
            { name: "Nguyễn Văn A", info: "Pháp danh: Tự Tại", tag: "Giảng Sư", quote: "Tâm an vạn sự an, tâm bình thế giới bình.", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400" },
            { name: "Nguyễn Văn A", info: "Pháp danh: Tự Tại", tag: "Học Viên Trưởng", quote: "Gieo mầm thiện tâm trên mảnh đất cố đô.", img: "https://images.unsplash.com/photo-1595210382422-42da097486bc?q=80&w=400" },
            { name: "Nguyễn Văn A", info: "Pháp danh: Tự Tại", tag: "Ban Trị Sự Lớp", quote: "Lan tỏa yêu thương đến mọi người xung quanh.", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400" },
            { name: "Nguyễn Văn A", info: "Pháp danh: Tự Tại", tag: "Học Viên", quote: "Tìm về sự tĩnh lặng giữa dòng đời.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400" }
        ],
        2024: [],
        2023: []
    };

    return {
        getMembersByYear: (year) => data[year] || [],
        getAllYears: () => Object.keys(data).sort((a, b) => b - a),
        getAllYearsHasMember: () => Object.keys(membersData).filter(year => membersData[year].length > 0).sort((a, b) => b - a)
    };
})();
