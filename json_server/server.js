const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Tệp dữ liệu chính
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Endpoint tùy chỉnh: Tính tổng điểm cho nhân viên
server.get('/api/diemtongnhanvien', (req, res) => {
    const db = router.db; // Truy cập dữ liệu từ db.json
    const nhanvien = db.get('nhanvien').value();
    const chinhanh = db.get('chinhanh').value();
    const phieudatmon = db.get('phieudatmon').value();
    const danhgia = db.get('danhgia').value();

    // Gộp dữ liệu từ các bảng
    const result = nhanvien.map(nv => {
        const chiNhanh = chinhanh.find(cn => cn.id === nv.MaChiNhanh) || {};
        const phieuCuaNhanVien = phieudatmon.filter(pm => pm.MaNhanVien === nv.id);
        const tongDiem = phieuCuaNhanVien.reduce((sum, pm) => {
            const dg = danhgia.find(d => d.MaPhieuMon === pm.id);
            return sum + (dg ? dg.DiemPhucVu : 0);
        }, 0);

        return {
            MaNhanVien: nv.id,
            HoTen: nv.HoTen,
            MaChiNhanh: nv.MaChiNhanh,
            TenChiNhanh: chiNhanh.TenChiNhanh || 'N/A',
            TongDiem: tongDiem
        };
    });

    res.json(result);
});

// Sử dụng router mặc định
server.use(router);

// Khởi động server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Custom Server is running on http://localhost:${PORT}`);
});