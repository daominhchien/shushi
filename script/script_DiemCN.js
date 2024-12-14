
async function getDiemTongNhanVien(callback) {
    try {
        const response = await fetch('http://localhost:3001/api/diemtongchinhanh');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        callback(data);
    } catch (error) {
        console.error('Error fetching total scores:', error);
    }
}


function renderDiemTong(list_diem) {
    const listDiem = document.querySelector('tbody');
    if (!listDiem) {
        console.error('No tbody element found');
        return;
    }

    const htmls = list_diem.map((diem, index) => {
        return `
            <tr class="diem-item-${diem.MaChiNhanh}">
                <td>${index + 1}</td>
                <td>${diem.MaChiNhanh}</td>
                <td>${diem.TenChiNhanh}</td>
                <td>${diem.TongDiem}</td>
            </tr>
        `;
    }).join('');

    listDiem.innerHTML = htmls;
}


document.addEventListener('DOMContentLoaded', function() {
    getDiemTongChiNhanh(renderDiemTong);
});

