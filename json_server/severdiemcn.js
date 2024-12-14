const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); 
const middlewares = jsonServer.defaults();

server.use(middlewares);


server.get('/api/diemtongchinhanhchinhanh', (req, res) => {
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


server.get('/api/diemchinhanh', (req, res) => {
    const db = router.db;
    const chinhanh = db.get('chinhanh').value();

    // Tính điểm cho mỗi chi nhánh
    const result = chinhanh.map(cn => {
        return {
            MaChiNhanh: cn.id,
            TenChiNhanh: cn.TenChiNhanh,
            DiemViTri: cn.DiemViTriChiNhanh || 0
        };
    });

    res.json(result);
});


server.use(router);


const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Custom Server is running on http://localhost:${PORT}`);
});