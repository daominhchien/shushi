document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addCustomerButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');

    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    addCustomerButton.addEventListener('click', function() {  
        addKhachHang();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
        modalTitle.textContent = 'Thêm Khách Hàng';
        formModal.style.backgroundColor = '';
    });

    saveButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Reset form function matching QLNV style
function resetForm() {
    document.querySelector('input[id="HoTen"]').value = '';
    document.querySelector('input[id="SDT"]').value = '';
    document.querySelector('input[id="Email"]').value = '';
    document.querySelector('input[id="CCCD"]').value = '';
    document.querySelector('select[id="GioiTinh"]').value = '';
    document.querySelector('input[id="MatKhau"]').value = '';
}

var khachHangAPI = 'http://localhost:3000/khachhang';

// Get customer data matching QLNV style
function getKhachHang(callback){
    var options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    fetch(khachHangAPI, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error fetching khachhang:', error));
}

// Create customer matching QLNV style
function createKhachHang(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(khachHangAPI, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error creating khachhang:', error));
}

// Delete customer matching QLNV style
function deleteKhachHang(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(khachHangAPI + '/' + id, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(){
            var khachHangItem = document.querySelector('.khachhang-item-' + id);
            if(khachHangItem){
                khachHangItem.remove();
            }
        })
        .catch(error => console.error('Error deleting khachhang:', error));
}

// Update customer matching QLNV style
function updateKhachHang(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(khachHangAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error updating khachhang:', error));
}

// Render customer list matching QLNV style
function renderKhachHang(list_khachhang){
    var listKhachHang = document.querySelector('tbody');
    if (!listKhachHang) {
        console.error('No tbody element found');
        return;
    }

    var htmls = list_khachhang.map(function(khachhang, index) {
        return `<tr class="khachhang-item-${khachhang.id}">
                    <td>${index + 1}</td>
                    <td>${khachhang.id}</td>
                    <td>${khachhang.HoTen}</td>
                    <td>${khachhang.SDT}</td>
                    <td>${khachhang.Email}</td>
                    <td>${khachhang.CCCD}</td>
                    <td>${khachhang.GioiTinh}</td>
                    <td>${khachhang.MatKhau}</td>
                    <td class="edit-icons">
                        <button onclick="editKhachHang('${khachhang.id}')">✎</button>
                        <button onclick="deleteKhachHang('${khachhang.id}', getKhachHang(renderKhachHang))">🗑️</button>
                    </td>
                </tr>`;
    }).join('');

    listKhachHang.innerHTML = htmls;
    console.log('Rendered HTML:', htmls);
}

// Add customer function matching QLNV style
function addKhachHang() {
    var HoTenInput = document.querySelector('input[id="HoTen"]');
    var SDTInput = document.querySelector('input[id="SDT"]');
    var EmailInput = document.querySelector('input[id="Email"]');
    var CCCDInput = document.querySelector('input[id="CCCD"]');
    var GioiTinhInput = document.querySelector('select[id="GioiTinh"]');
    var MatKhauInput = document.querySelector('input[id="MatKhau"]');

    if (HoTenInput && SDTInput && EmailInput && CCCDInput && GioiTinhInput && MatKhauInput) {
        var HoTen = HoTenInput.value.trim();
        var SDT = SDTInput.value.trim();
        var Email = EmailInput.value.trim();
        var CCCD = CCCDInput.value.trim();
        var GioiTinh = GioiTinhInput.value.trim();
        var MatKhau = MatKhauInput.value.trim();

        if (HoTen === "" || SDT === "" || Email === "" || CCCD === "" || GioiTinh === "" || MatKhau === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return;
        }

        var data = {
            HoTen: HoTen,
            SDT: SDT,
            Email: Email,
            CCCD: CCCD,
            GioiTinh: GioiTinh,
            MatKhau: MatKhau
        };

        createKhachHang(data, function() {
            getKhachHang(renderKhachHang);
            resetForm();
        });
    }
}
function editKhachHang(id) {
    fetch(khachHangAPI + '/' + id)
        .then(function(response) {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(function(khachHang) {
            if (khachHang) {
                // Populate form fields
                document.querySelector('input[id="HoTen"]').value = khachHang.HoTen;
                document.querySelector('input[id="SDT"]').value = khachHang.SDT;
                document.querySelector('input[id="Email"]').value = khachHang.Email;
                document.querySelector('input[id="CCCD"]').value = khachHang.CCCD;
                document.querySelector('select[id="GioiTinh"]').value = khachHang.GioiTinh;
                document.querySelector('input[id="MatKhau"]').value = khachHang.MatKhau;

                // Show modal
                var modalOverlay = document.querySelector('#modalOverlay');
                var addButton = document.querySelector('#addPlaneButton');
                var saveButton = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3');
                var formModal = document.querySelector('.modal');

                modalOverlay.style.display = 'flex';
                addButton.style.display = 'none';
                saveButton.style.display = 'inline-block';
                modalTitle.textContent = 'Chỉnh sửa Khách Hàng';
                formModal.style.backgroundColor = '#e8f5e9';
                document.body.style.overflow = 'hidden';

                // Remove existing click handlers
                saveButton.onclick = null;

                // Add new click handler
                saveButton.onclick = function() {
                    var formData = {
                        HoTen: document.querySelector('input[id="HoTen"]').value.trim(),
                        SDT: document.querySelector('input[id="SDT"]').value.trim(),
                        Email: document.querySelector('input[id="Email"]').value.trim(),
                        CCCD: document.querySelector('input[id="CCCD"]').value.trim(),
                        GioiTinh: document.querySelector('select[id="GioiTinh"]').value.trim(),
                        MatKhau: document.querySelector('input[id="MatKhau"]').value.trim()
                    };

                    if (Object.values(formData).some(function(value) { return !value; })) {
                        alert("Vui lòng điền đầy đủ thông tin");
                        return;
                    }

                    updateKhachHang(id, formData, function() {
                        getKhachHang(renderKhachHang);
                        modalOverlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        modalTitle.textContent = 'Thêm Khách Hàng';
                        addButton.style.display = 'inline-block';
                        saveButton.style.display = 'none';
                        formModal.style.backgroundColor = '';
                        resetForm();
                    });
                };
            }
        })
        .catch(function(error) {
            console.error('Error editing khachhang:', error);
        });
}


function start(){
    getKhachHang(renderKhachHang);
}

document.addEventListener('DOMContentLoaded', function () {
    start();
});

document.addEventListener('DOMContentLoaded', function() {

    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchKhachHang(searchTerm);
        } else {
            getKhachHang(renderKhachHang); // Hiển thị toàn bộ danh sách nếu không nhập gì
        }
    });

    // Tìm kiếm khi người dùng nhập
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getKhachHang(renderKhachHang); // Hiển thị toàn bộ danh sách nếu không nhập gì
        }
    });
});

function searchKhachHang(searchTerm) {
    fetch(khachHangAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(customers) {
            const filteredCustomers = customers.filter(function(customer) {
                const id = customer.id; // Lấy ID của khách hàng
                const hoten = customer.HoTen ? customer.HoTen.toLowerCase() : ''; // Lấy Họ tên và chuyển thành chữ thường
                
                // So sánh theo ID (kiểm tra nếu id và searchTerm đều là số)
                if (typeof id === 'number' && !isNaN(searchTerm)) {
                    return id === Number(searchTerm);
                } 
                // So sánh theo ID (nếu id là chuỗi)
                else if (typeof id === 'string') {
                    return id.toLowerCase() === searchTerm;
                } 
                // So sánh theo Họ tên (nếu searchTerm khớp một phần với Họ tên)
                else if (hoten.includes(searchTerm)) {
                    return true;
                }
                // Nếu không khớp, trả về false
                return false;
            });
            renderKhachHang(filteredCustomers);
        })
        .catch(error => console.error('Error searching khachhang:', error));
}
