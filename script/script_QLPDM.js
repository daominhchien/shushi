

const APIs = {
    datve: 'http://localhost:3000/ONLINEDATVE',
    taicho: 'http://localhost:3000/ONLINETAICHO',
    offline: 'http://localhost:3000/PHIEUDATOFFLINE'
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

            return `<tr class="order-item-${order.type}-${order.id}" data-type="${order.type}" data-id="${order.id}">
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
function deleteOrder(type, id) {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) {
        return;
    }

    const endpoints = {
        'online': 'online',
        'taicho': 'taicho', 
        'offline': 'offline'
    };

    const resource = endpoints[type];
    if (!resource) {
        toastr.error('Loại đơn không hợp lệ');
        return;
    }

   
    const orderItem = document.querySelector(`.order-item-${type}-${id}`);
    if (orderItem) {
        orderItem.remove();
    }

    fetch(`http://localhost:3000/${resource}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        toastr.success('Xóa thành công');
    })
    .catch(error => {
        console.error('Delete error:', error);
        toastr.error('Lỗi khi xóa');
        renderPhieuDatMon(); // Re-render only on error
    });
}
document.addEventListener('DOMContentLoaded', () => {
    renderPhieuDatMon();
});
async function editOrder(type, orderId) {
    try {
        // Fetch order and related data
        const [order, employees, branches, customers] = await Promise.all([
            fetch(`${APIs[type]}/${orderId}`).then(res => res.json()),
            fetch('http://localhost:3000/nhanvien').then(res => res.json()),
            fetch('http://localhost:3000/chinhanh').then(res => res.json()),
            fetch('http://localhost:3000/khachhang').then(res => res.json())
        ]);

        // Build common form fields
        let formContent = `
            <div class="edit-form">
                <h2>Chỉnh sửa đơn hàng</h2>
                <form id="editOrderForm" onsubmit="handleEditSubmit(event, '${type}', ${orderId})">
                    <div class="form-group">
                        <label>Nhân viên:</label>
                        <select name="MaNhanVien" required>
                            ${employees.map(nv => `
                                <option value="${nv.id}" ${nv.id === order.MaNhanVien ? 'selected' : ''}>
                                    ${nv.HoTen}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Chi nhánh:</label>
                        <select name="MaChiNhanh" required>
                            ${branches.map(cn => `
                                <option value="${cn.id}" ${cn.id === order.MaChiNhanh ? 'selected' : ''}>
                                    ${cn.TenChiNhanh}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Khách hàng:</label>
                        <select name="MaKhachHang" required>
                            ${customers.map(kh => `
                                <option value="${kh.id}" ${kh.id === order.MaKhachHang ? 'selected' : ''}>
                                    ${kh.HoTen}
                                </option>
                            `).join('')}
                        </select>
                    </div>`;

        // Add type-specific fields
        switch(type) {
            case 'datve':
                formContent += `
                    <div class="form-group">
                        <label>Địa chỉ:</label>
                        <input type="text" name="DiaChi" value="${order.DiaChi || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Phí giao hàng:</label>
                        <input type="number" name="PhiGiaoHang" value="${order.PhiGiaoHang || ''}">
                    </div>`;
                break;
            case 'taicho':
                formContent += `
                    <div class="form-group">
                        <label>Số bàn:</label>
                        <input type="number" name="SoBan" value="${order.SoBan || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Ngày đến:</label>
                        <input type="date" name="NgayDen" value="${order.NgayDen || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Giờ đến:</label>
                        <input type="time" name="GioDen" value="${order.GioDen || ''}" required>
                    </div>`;
                break;
            case 'offline':
                formContent += `
                    <div class="form-group">
                        <label>Số bàn:</label>
                        <input type="number" name="SoBan" value="${order.SoBan || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Ngày lập:</label>
                        <input type="date" name="NgayLap" value="${order.NgayLap?.split('T')[0] || ''}" required>
                    </div>`;
                break;
        }

        formContent += `
                    <div class="form-group">
                        <label>Ghi chú:</label>
                        <input type="input" name="GhiChu" value="${order.GhiChu || ''}" >
                    </div>
                    <div class="button-group">
                        <button type="submit">Lưu</button>
                        <button type="button" onclick="closeModal()">Hủy</button>
                    </div>
                </form>
            </div>`;

        showModal(formContent);

    } catch (error) {
        console.error('Error:', error);
        toastr.error('Lỗi khi tải dữ liệu');
    }
}

async function checkTableAvailable(chiNhanhId, tableNumber, currentOrderId = null) {
    try {
        console.log('Checking table:', {chiNhanhId, tableNumber, currentOrderId}); // Debug

        const [offlineOrders, taichoOrders] = await Promise.all([
            fetch('http://localhost:3000/PHIEUDATOFFLINE').then(res => res.json()),
            fetch('http://localhost:3000/ONLINETAICHO').then(res => res.json())
        ]);

        // Normalize input values
        const targetChiNhanh = String(chiNhanhId).trim();
        const targetTable = String(tableNumber).trim();

        // Debug log
        console.log('All orders:', [...offlineOrders, ...taichoOrders]);

        const conflictingOrder = [...offlineOrders, ...taichoOrders].find(order => {
            // Skip current order
            if (currentOrderId && order.id === currentOrderId) {
                return false;
            }

            const orderChiNhanh = String(order.MaChiNhanh).trim();
            const orderTable = String(order.SoBan).trim();

            console.log('Comparing:', {
                orderChiNhanh, targetChiNhanh,
                orderTable, targetTable,
                match: orderChiNhanh === targetChiNhanh && orderTable === targetTable
            });

            return orderChiNhanh === targetChiNhanh && 
                   orderTable === targetTable;
        });

        if (conflictingOrder) {
            console.log('Conflict found:', conflictingOrder); // Debug
            throw new Error(`Bàn ${targetTable} đã được đặt trước tại chi nhánh này`);
        }

        return true;
    } catch (error) {
        console.error('Table check error:', error);
        throw error;
    }
}

async function handleEditSubmit(event, type, orderId) {
    event.preventDefault();
    try {
        const form = event.target;
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData);

        console.log('Edit data:', {type, orderId, orderData}); // Debug

        if ((type === 'taicho' || type === 'offline') && orderData.SoBan) {
            const originalOrder = await fetch(`${APIs[type]}/${orderId}`).then(res => res.json());
            
            console.log('Original order:', originalOrder); // Debug

            // Add strict validation
            if (!orderData.MaChiNhanh || !orderData.SoBan) {
                toastr.error('Thiếu thông tin bàn hoặc chi nhánh');
                return;
            }

            if (String(originalOrder.SoBan) !== String(orderData.SoBan) || 
                String(originalOrder.MaChiNhanh) !== String(orderData.MaChiNhanh)) {
                
                let isAvailable = false;
                try {
                    isAvailable = await checkTableAvailable(
                        orderData.MaChiNhanh,
                        orderData.SoBan,
                        orderId
                    );
                } catch (error) {
                    console.error('Table check failed:', error); // Debug
                    toastr.error(error.message);
                    return false;
                }

                if (!isAvailable) {
                    toastr.error('Bàn đã được đặt');
                    return false;
                }
            }
        }

        const response = await fetch(`${APIs[type]}/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cập nhật thất bại: ${errorText}`);
        }

        toastr.success('Cập nhật thành công');
        closeModal();
        renderPhieuDatMon();

    } catch (error) {
        console.error('Update error:', error);
        toastr.error(error.message);
        return false;
    }
}


async function checkTableAvailable(chiNhanhId, tableNumber) {
    try {

        const [offlineOrders, onlineOrders] = await Promise.all([
            fetch('http://localhost:3000/PHIEUDATOFFLINE').then(res => res.json()),
            fetch('http://localhost:3000/ONLINETAICHO').then(res => res.json()) 
        ]);


        const isTableTaken = [...offlineOrders, ...onlineOrders].some(order => 
            order.MaChiNhanh === chiNhanhId && 
            order.SoBan === tableNumber
        );

        return !isTableTaken;
    } catch (error) {
        console.error('Error checking table:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addPlaneButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');


    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 3000
    };


    openModalButton.addEventListener('click', async function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        await loadSelectData();
    });


    addPlaneButton.addEventListener('click', async function() {
        const MaNhanVien = document.getElementById('MaNhanVien').value;
        const MaChiNhanh = document.getElementById('MaChiNhanh').value;
        const MaKhachHang = document.getElementById('MaKhachHang').value;
        const SoBan = document.getElementById('SoBan').value;
        const NgayLap = document.getElementById('NgayLap')?.value || '';


        if (!MaNhanVien || !MaChiNhanh || !MaKhachHang || !SoBan || !NgayLap) {
            toastr.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {

        const isAvailable = await checkTableAvailable(MaChiNhanh, SoBan);
        if (!isAvailable) {
            toastr.error(`Bàn ${SoBan} đã có người đặt`);
            return;
        }


        
            const newOrder = {
                id: Date.now().toString(),
                MaNhanVien,
                MaChiNhanh,
                MaKhachHang,
                SoBan,
                NgayLap,
                type: 'offline'
            };

         
            const response = await fetch('http://localhost:3000/PHIEUDATOFFLINE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const savedOrder = await response.json();

       
            renderPhieuDatMon();
            
       
            document.getElementById('addPlaneForm').reset();
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            toastr.success('Thêm phiếu thành công');

        } catch (error) {
            console.error('Error:', error);
            toastr.error('Lỗi khi thêm phiếu');
        }
    });


    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('addPlaneForm').reset();
    });
});

async function loadSelectData() {
    try {
        const [nhanvien, chinhanh, khachhang] = await Promise.all([
            fetch('http://localhost:3000/nhanvien').then(res => res.json()),
            fetch('http://localhost:3000/chinhanh').then(res => res.json()),
            fetch('http://localhost:3000/khachhang').then(res => res.json())
        ]);

 
        document.getElementById('MaNhanVien').innerHTML = `
            <option value="">Chọn nhân viên</option>
            ${nhanvien.map(nv => `<option value="${nv.id}">${nv.HoTen}</option>`).join('')}`;

        document.getElementById('MaChiNhanh').innerHTML = `
            <option value="">Chọn chi nhánh</option>
            ${chinhanh.map(cn => `<option value="${cn.id}">${cn.TenChiNhanh}</option>`).join('')}`;

        document.getElementById('MaKhachHang').innerHTML = `
            <option value="">Chọn khách hàng</option>
            ${khachhang.map(kh => `<option value="${kh.id}">${kh.HoTen}</option>`).join('')}`;

    } catch (error) {
        console.error('Error loading data:', error);
        toastr.error('Lỗi tải dữ liệu');
    }
}


function resetForm() {
    const form = document.getElementById('addPlaneForm');
    if (form) {
        form.reset();
    }
}
// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners...

    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

 
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchPhieuDat(searchTerm);
        } else {
            renderPhieuDatMon(); 
        }
    });


    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            renderPhieuDatMon();
        }
    });
});


async function searchPhieuDat(searchTerm) {
    try {
        const allOrders = await getAllOrders();
        const khachHang = await fetch('http://localhost:3000/khachhang').then(res => res.json());

        const lowerSearchTerm = searchTerm.trim().toLowerCase();
        
        const filteredOrders = allOrders.filter(order => {
            const kh = khachHang.find(k => k.id.toString() === order.MaKhachHang.toString());
            const customerName = kh ? kh.HoTen.toLowerCase() : '';

  
            if (typeof order.id === 'string' && order.id.toLowerCase() === lowerSearchTerm) {
                return true;
            }
            if (typeof order.id === 'number' && order.id.toString() === searchTerm) {
                return true;
            }

       
            if (customerName === lowerSearchTerm) {
                return true;
            }

            return false;
        });

     
        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const html = filteredOrders.map((order, index) => {
            const kh = khachHang.find(k => k.id.toString() === order.MaKhachHang.toString());
            const hoTen = kh ? kh.HoTen : 'Unknown';
            const typeText = {
                datve: 'Đặt ship về',
                taicho: 'Đặt tại chỗ',
                offline: 'Đặt offline' 
            }[order.type];

            return `<tr class="order-item-${order.type}-${order.id}" data-type="${order.type}" data-id="${order.id}">
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
        console.error('Error searching orders:', error);
        toastr.error('Lỗi khi tìm kiếm');
    }
}