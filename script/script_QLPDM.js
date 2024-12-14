// document.addEventListener('DOMContentLoaded', function() {
//     const openModalButton = document.getElementById('openModalButton');
//     const modalOverlay = document.getElementById('modalOverlay');
//     const addPlaneButton = document.getElementById('addPlaneButton');
//     const closeModalButton = document.getElementById('closeModalButton');
//     const saveButton = document.querySelector('.save-button');
//     const formModal = document.querySelector('.modal');

//     // Open modal
//     openModalButton.addEventListener('click', function() {
//         modalOverlay.style.display = 'flex';
//         document.body.style.overflow = 'hidden';
//     });

//     // Add new "Phiếu Đặt Món"
//     addPlaneButton.addEventListener('click', function() {
//         addPhieuDatMon();
//         modalOverlay.style.display = 'none';
//         document.body.style.overflow = 'auto';
//     });

//     // Close modal
//     closeModalButton.addEventListener('click', function() {
//         modalOverlay.style.display = 'none';
//         document.body.style.overflow = 'auto';
//         resetForm();
//         document.querySelector('#addPlaneButton').style.display = 'inline-block';
//         document.querySelector('.save-button').style.display = 'none';
//         document.querySelector('.modal h3').textContent = 'Thêm Phiếu Đặt Món';
//         formModal.style.backgroundColor = '';
//     });

//     // Save changes
//     saveButton.addEventListener('click', function() {
//         modalOverlay.style.display = 'none';
//         document.body.style.overflow = 'auto';
//     });
// });

// function resetForm() {
//     document.querySelector('select[id="MaNhanVien"]').value = '';
//     document.querySelector('select[id="MaChiNhanh"]').value = '';
//     document.querySelector('select[id="MaKhachHang"]').value = '';
// }

// async function fetchAllData() {
//     try {
//         const nhanVienResponse = fetch('http://localhost:3000/nhanvien');
//         const chiNhanhResponse = fetch('http://localhost:3000/chinhanh');
//         const khachHangResponse = fetch('http://localhost:3000/khachhang');

//         const [nhanVienData, chiNhanhData, khachHangData] = await Promise.all([
//             nhanVienResponse.then(res => res.json()),
//             chiNhanhResponse.then(res => res.json()),
//             khachHangResponse.then(res => res.json())
//         ]);

//         return {
//             nhanvien: nhanVienData,
//             chinhanh: chiNhanhData,
//             khachhang: khachHangData
//         };
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// }

// function populateSelect(selectId, data, labelKey, valueKey) {
//     const selectElement = document.getElementById(selectId);
//     selectElement.innerHTML = '<option value="">-- Chọn --</option>';
//     data.forEach(item => {
//         const option = document.createElement('option');
//         option.value = item[valueKey];
//         option.textContent = item[labelKey];
//         selectElement.appendChild(option);
//     });
// }

// async function init() {
//     try {
//         const { nhanvien, chinhanh, khachhang } = await fetchAllData();
//         populateSelect('MaNhanVien', nhanvien, 'HoTen', 'id');
//         populateSelect('MaChiNhanh', chinhanh, 'TenChiNhanh', 'id');
//         populateSelect('MaKhachHang', khachhang, 'HoTen', 'id');
//     } catch (error) {
//         console.error('Error initializing data:', error);
//     }
// }

// init();

// var phieuDatMonAPI = 'http://localhost:3000/datve';
// var 

// document.addEventListener('DOMContentLoaded', function () {
//     start();
// });

// function start() {
//     getPhieuDatMon(renderPhieuDatMon);
// }

// function getPhieuDatMon(callback) {
//     fetch(phieuDatMonAPI)
//         .then(function(response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(callback)
//         .catch(error => console.error('Error fetching phieudatmon:', error));
// }

// function createPhieuDatMon(data, callback) {
//     var options = {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             "Content-Type": "application/json",
//         }
//     };

//     fetch(phieuDatMonAPI, options)
//         .then(function(response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(callback)
//         .catch(error => console.error('Error creating phieudatmon:', error));
// }

// function deletePhieuDatMon(id, callback) {
//     var options = {
//         method: 'DELETE',
//         headers: {
//             "Content-Type": "application/json",
//         }
//     };

//     fetch(phieuDatMonAPI + '/' + id, options)
//         .then(function(response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(function() {
//             var phieuDatMonItem = document.querySelector('.phieudatmon-item-' + id);
//             if(phieuDatMonItem) {
//                 phieuDatMonItem.remove();
//             }
//         })
//         .catch(error => console.error('Error deleting phieudatmon:', error));
// }

// function updatePhieuDatMon(id, data, callback) {
//     var options = {
//         method: 'PUT',
//         body: JSON.stringify(data),
//         headers: {
//             "Content-Type": "application/json",
//         }
//     };

//     fetch(phieuDatMonAPI + '/' + id, options)
//         .then(function(response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(callback)
//         .catch(error => console.error('Error updating phieudatmon:', error));
// }

// async function renderPhieuDatMon(list_phieudatmon) {
//     var listPhieuDatMon = document.querySelector('tbody');
//     if (!listPhieuDatMon) {
//         console.error('No tbody element found');
//         return;
//     }

//     try {
        
//         const khachHangResponse = await fetch('http://localhost:3000/khachhang');
//         const khachHang = await khachHangResponse.json();

//         var htmls = list_phieudatmon.map(function(phieudatmon, index) {
            
//             const kh = khachHang.find(k => k.id.toString() === phieudatmon.MaKhachHang.toString());
//             const hoTen = kh ? kh.HoTen : 'Unknown';

//             return `<tr class="phieudatmon-item-${phieudatmon.id}">
//                     <td>${index + 1}</td>
//                     <td>${phieudatmon.id}</td>
//                     <td>${phieudatmon.MaNhanVien}</td>
//                     <td>${phieudatmon.MaChiNhanh}</td>
//                     <td>${phieudatmon.MaKhachHang}</td>
//                     <td>${hoTen}</td>
//                     <td>${loaithe}</td>
//                     <td class="edit-icons">
//                         <button onclick="editPhieuDatMon('${phieudatmon.id}')">✎</button>
//                         <button onclick="viewOrderDetails('${phieudatmon.id}')">Chi tiết</button>
//                         <button onclick="deletePhieuDatMon('${phieudatmon.id}', getPhieuDatMon(renderPhieuDatMon))">🗑️</button>
//                     </td>
//                 </tr>`;
//         }).join('');

//         listPhieuDatMon.innerHTML = htmls;
//     } catch (error) {
//         console.error('Error fetching KhachHang data:', error);
//     }
// }

// function addPhieuDatMon() {
//     var MaNhanVienInput = document.querySelector('select[id="MaNhanVien"]');
//     var MaChiNhanhInput = document.querySelector('select[id="MaChiNhanh"]');
//     var MaKhachHangInput = document.querySelector('select[id="MaKhachHang"]');

//     if (MaNhanVienInput && MaChiNhanhInput && MaKhachHangInput) {
//         var MaNhanVien = MaNhanVienInput.value.trim();
//         var MaChiNhanh = MaChiNhanhInput.value.trim();
//         var MaKhachHang = MaKhachHangInput.value.trim();

//         if (MaNhanVien === "" || MaChiNhanh === "" || MaKhachHang === "") {
//             alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
//             return;
//         }

//         var data = {
//             MaNhanVien: MaNhanVien,
//             MaChiNhanh: MaChiNhanh,
//             MaKhachHang: MaKhachHang
//         };

//         createPhieuDatMon(data, function() {
//             getPhieuDatMon(renderPhieuDatMon);
//             resetForm();
//         });
//     }
// }

// function editPhieuDatMon(id) {
//     console.log('editPhieuDatMon called with id:', id); // Debugging log
//     fetch(phieuDatMonAPI)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(phieudatmons) {
//             console.log('Fetched phieudatmons:', phieudatmons); 
//             var phieudatmon = phieudatmons.find(function(pdm) {
//                 return pdm.id == id; 
//             });

//             if (phieudatmon) {
//                 console.log('PhieuDatMon found:', phieudatmon);
//                 var MaNhanVienInput = document.querySelector('select[id="MaNhanVien"]');
//                 var MaChiNhanhInput = document.querySelector('select[id="MaChiNhanh"]');
//                 var MaKhachHangInput = document.querySelector('select[id="MaKhachHang"]');
                
//                 var themBtn = document.querySelector('#addPlaneButton');
//                 var formContainer = document.querySelector('#modalOverlay');
//                 var saveBtn = document.querySelector('.save-button');
//                 var modalTitle = document.querySelector('.modal h3');
//                 var formModal = document.querySelector('.modal');

//                 MaNhanVienInput.value = phieudatmon.MaNhanVien;
//                 MaChiNhanhInput.value = phieudatmon.MaChiNhanh;
//                 MaKhachHangInput.value = phieudatmon.MaKhachHang;

//                 modalTitle.textContent = 'Chỉnh sửa';
//                 formModal.style.backgroundColor = '#e8f5e9';

//                 formContainer.style.display = 'flex';
//                 document.body.style.overflow = 'hidden';
//                 themBtn.style.display = 'none';
//                 saveBtn.style.display = 'inline-block';

//                 saveBtn.onclick = function() {
//                     console.log('Save button clicked'); 
//                     var MaNhanVien = MaNhanVienInput.value.trim();
//                     var MaChiNhanh = MaChiNhanhInput.value.trim();
//                     var MaKhachHang = MaKhachHangInput.value.trim();

//                     if (MaNhanVien === "" || MaChiNhanh === "" || MaKhachHang === "") {
//                         alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
//                         return;
//                     }

//                     var updatedPhieuDatMon = {
//                         MaNhanVien: MaNhanVien,
//                         MaChiNhanh: MaChiNhanh,
//                         MaKhachHang: MaKhachHang
//                     };

//                     updatePhieuDatMon(id, updatedPhieuDatMon, function() {
//                         getPhieuDatMon(renderPhieuDatMon);
//                         resetForm();

//                         modalTitle.textContent = 'Thêm Phiếu Đặt Món';
//                         saveBtn.style.display = 'none';
//                         themBtn.style.display = 'inline-block';
//                         formContainer.style.display = 'none';
//                         document.body.style.overflow = 'auto';
//                         formModal.style.backgroundColor = '';
//                     });
//                 };
//             } else {
//                 console.error('PhieuDatMon not found'); // Debugging log
//             }
//         })
//         .catch(error => console.error('Error editing phieudatmon:', error));
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const searchButton = document.getElementById('searchButton');
//     const searchInput = document.getElementById('searchInput');

//     searchButton.addEventListener('click', function() {
//         const searchTerm = searchInput.value.trim().toLowerCase();
//         if (searchTerm) {
//             searchPhieuDatMon(searchTerm);
//         } else {
//             getPhieuDatMon(renderPhieuDatMon);
//         }
//     });

//     searchInput.addEventListener('input', function() {
//         const searchTerm = searchInput.value.trim().toLowerCase();
//         if (!searchTerm) {
//             getPhieuDatMon(renderPhieuDatMon);
//         }
//     });
// });

// function searchPhieuDatMon(searchTerm) {
//     fetch(phieuDatMonAPI)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function(phieudatmons) {
//             const filteredPhieuDatMons = phieudatmons.filter(function(phieudatmon) {
//                 const id = phieudatmon.id;

//                 if (typeof id === 'string' && typeof searchTerm === 'string') {
//                     return id.toLowerCase() === searchTerm;
//                 } else if (typeof id === 'number' && !isaaNaN(searchTerm)) {
//                     return id === Number(searchTerm);
//                 } else {
//                     return id.toString().toLowerCase() === searchTerm;
//                 }
//             });
//             renderPhieuDatMon(filteredPhieuDatMons);
//         })
//         .catch(error => console.error('Error searching phieudatmon:', error));
// }
const APIs = {
    datve: 'http://localhost:3000/datve',
    taicho: 'http://localhost:3000/taicho',
    offline: 'http://localhost:3000/offline'
};

async function getAllOrders() {
    try {
        const [datveOrders, taichoOrders, offlineOrders] = await Promise.all([
            fetch(APIs.datve).then(res => res.json()),
            fetch(APIs.taicho).then(res => res.json()),
            fetch(APIs.offline).then(res => res.json())
        ]);

        return [
            ...datveOrders.map(order => ({...order, type: 'datve'})),
            ...taichoOrders.map(order => ({...order, type: 'taicho'})),
            ...offlineOrders.map(order => ({...order, type: 'offline'}))
        ];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

async function renderPhieuDatMon() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    try {
        const allOrders = await getAllOrders();
        const khachHang = await fetch('http://localhost:3000/khachhang').then(res => res.json());

        const html = allOrders.map((order, index) => {
            const kh = khachHang.find(k => k.id.toString() === order.MaKhachHang.toString());
            const hoTen = kh ? kh.HoTen : 'Unknown';
            const typeText = {
                datve: 'Đặt ship về',
                taicho: 'Đặt tại chỗ', 
                offline: 'Đặt offline'
            }[order.type];

            return `<tr>
                <td>${index + 1}</td>
                <td>${order.id}</td>
                <td>${order.MaNhanVien}</td>
                <td>${order.MaChiNhanh}</td>
                <td>${order.MaKhachHang}</td>
                <td>${hoTen}</td>
                <td>${typeText}</td>
                <td>
                    <button onclick="editOrder('${order.type}', '${order.id}')">✎</button>
                    <button onclick="viewOrderDetails('${order.type}', '${order.id}')">👁️</button>
                    <button onclick="deleteOrder('${order.type}', '${order.id}')">🗑️</button>
                </td>
            </tr>`;
        }).join('');

        tbody.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function viewOrderDetails(type, id) {
    try {
        const response = await fetch(`${APIs[type]}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch order details');
        
        const order = await response.json();
        let detailsHTML = `
            <div class="order-details">
                <h2>Chi tiết đơn hàng #${id}</h2>
                <table class="details-table">
                    <tr>
                        <th>Loại đơn</th>
                        <td>${type === 'datve' ? 'Đặt ship về' : type === 'taicho' ? 'Đặt tại chỗ' : 'Đặt offline'}</td>
                    </tr>
                    ${getOrderDetailsRows(type, order)}
                </table>
                <div class="button-group">
                    <button onclick="closeModal()">Đóng</button>
                </div>
            </div>`;
        showModal(detailsHTML);
    } catch (error) {
        console.error('Error:', error);
        alert('Không thể tải thông tin đơn hàng');
    }
}

function getOrderDetailsRows(type, order) {
    switch(type) {
        case 'datve':
            return `
                <tr><th>Thời điểm truy cập</th><td>${order.ThoiDiemTruyCap || ''}</td></tr>
                <tr><th>Thời gian truy cập</th><td>${order.ThoiGianTruyCap || ''}</td></tr>
                <tr><th>Ghi chú</th><td>${order.GhiChu || ''}</td></tr>
                <tr><th>Địa chỉ</th><td>${order.DiaChi || ''}</td></tr>
                <tr><th>Tình trạng</th><td>${order.TinhTrang || ''}</td></tr>
                <tr><th>Phí giao hàng</th><td>${order.PhiGiaoHang || ''}</td></tr>`;
        case 'taicho':
            return `
                <tr><th>Số bàn</th><td>${order.SoBan || ''}</td></tr>
                <tr><th>Thời điểm truy cập</th><td>${order.ThoiDiemTruyCap || ''}</td></tr>
                <tr><th>Thời gian truy cập</th><td>${order.ThoiGianTruyCap || ''}</td></tr>
                <tr><th>Ghi chú</th><td>${order.GhiChu || ''}</td></tr>
                <tr><th>Ngày đến</th><td>${order.NgayDen || ''}</td></tr>
                <tr><th>Giờ đến</th><td>${order.GioDen || ''}</td></tr>`;
        case 'offline':
            return `
                <tr><th>Số bàn</th><td>${order.SoBan || ''}</td></tr>
                <tr><th>Ngày lập</th><td>${order.NgayLap || ''}</td></tr>`;
        default:
            return '';
    }
}

function showModal(content) {
    let modal = document.getElementById('orderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orderModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            ${content}
        </div>`;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    renderPhieuDatMon();
});
async function editOrder(type, orderId) {
    try {
        // Fetch necessary data
        const order = await fetch(`http://localhost:3000/orders/${orderId}`).then(res => res.json());
        const employees = await fetch('http://localhost:3000/nhanvien').then(res => res.json());
        const branches = await fetch('http://localhost:3000/chinhanh').then(res => res.json());
        const customers = await fetch('http://localhost:3000/khachhang').then(res => res.json());

        const content = `
            <div class="edit-form">
                <h2>Chỉnh sửa phiếu đặt món</h2>
                <div class="form-group">
                    <label>Nhân viên:</label>
                    <select id="MaNhanVien">
                        ${employees.map(nv => `
                            <option value="${nv.id}" ${nv.id === order.MaNhanVien ? 'selected' : ''}>
                                ${nv.HoTen}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Chi nhánh:</label>
                    <select id="MaChiNhanh">
                        ${branches.map(cn => `
                            <option value="${cn.id}" ${cn.id === order.MaChiNhanh ? 'selected' : ''}>
                                ${cn.TenChiNhanh}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Khách hàng:</label>
                    <select id="MaKhachHang">
                        ${customers.map(kh => `
                            <option value="${kh.id}" ${kh.id === order.MaKhachHang ? 'selected' : ''}>
                                ${kh.HoTen}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <button onclick="updateOrder('${orderId}')">Cập nhật</button>
            </div>`;
        
        showModal(content);
    } catch (error) {
        console.error('Error:', error);
    }
}

