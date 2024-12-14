document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addBranchButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');

    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    addBranchButton.addEventListener('click', function() {
        addBranch();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
        modalTitle.textContent = 'Thêm Chi Nhánh';
        formModal.style.backgroundColor = '';
    });

    saveButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

function resetForm() {
    document.querySelector('input[id="TenChiNhanh"]').value = '';
    document.querySelector('select[id="MaQuanLy"]').value = '';
    document.querySelector('input[id="DiaChi"]').value = '';
    document.querySelector('input[id="SDT"]').value = '';
    document.querySelector('input[id="TGMoCua"]').value = '';
    document.querySelector('input[id="TGDongCua"]').value = '';
    document.querySelector('select[id="BaiDoXe"]').value = '';
}

async function fetchAllData() {
    try {
        const nhanVienResponse = fetch('http://localhost:3000/nhanvien');
        const [nhanVienData] = await Promise.all([
            nhanVienResponse.then(res => res.json())
        ]);

        return {
            nhanVien: nhanVienData 
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function populateSelect(selectId, data, labelKey, valueKey) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">-- Chọn --</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        selectElement.appendChild(option);
    });
}

async function init() {
    try {
        const { nhanVien } = await fetchAllData();
        populateSelect('MaQuanLy', nhanVien, 'HoTen', 'id');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

init();

var chiNhanhAPI = 'http://localhost:3000/chinhanh';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getChiNhanh(renderChiNhanh);
}

function getChiNhanh(callback){
    fetch(chiNhanhAPI)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(callback)
    .catch(error => console.error('Error fetching chinhanh:', error));
}

function createChiNhanh(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(chiNhanhAPI, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error creating chinhanh:', error));
}

function deleteChiNhanh(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(chiNhanhAPI + '/' + id, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(){
            var chiNhanhItem = document.querySelector('.chinhanh-item-' + id);
            if(chiNhanhItem){
                chiNhanhItem.remove();
            }
        })
        .catch(error => console.error('Error deleting chinhanh:', error));
}

function updateChiNhanh(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(chiNhanhAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error updating chinhanh:', error));
}

function renderChiNhanh(list_chinhanh){
    var listChiNhanh = document.querySelector('tbody');
    if (!listChiNhanh) {
        console.error('No tbody element found');
        return;
    }

    var htmls = list_chinhanh.map(function(chinhanh, index) {
        return `<tr class="chinhanh-item-${chinhanh.id}">
                    <td>${index + 1}</td>
                    <td>${chinhanh.id}</td>
                    <td>${chinhanh.TenChiNhanh}</td>
                    <td>${chinhanh.MaQuanLy}</td>
                    <td>${chinhanh.DiaChi}</td>
                    <td>${chinhanh.TGMoCua}</td>
                    <td>${chinhanh.TGDongCua}</td>
                    <td>${chinhanh.SDT}</td>
                    <td>${chinhanh.BaiDoXe}</td>
                    <td class="edit-icons">
                        <button onclick="editChiNhanh('${chinhanh.id}')">✎</button>
                        <button onclick="deleteChiNhanh('${chinhanh.id}', getChiNhanh(renderChiNhanh))">🗑️</button>
                    </td>
                </tr>`;
    }).join('');

    listChiNhanh.innerHTML = htmls;
    console.log('Rendered HTML:', htmls);
}

function addBranch() {
    var TenChiNhanhInput = document.querySelector('input[id="TenChiNhanh"]');
    var MaQuanLyInput = document.querySelector('select[id="MaQuanLy"]');
    var DiaChiInput = document.querySelector('input[id="DiaChi"]');
    var SDTInput = document.querySelector('input[id="SDT"]');
    var TGMoCuaInput = document.querySelector('input[id="TGMoCua"]');
    var TGDongCuaInput = document.querySelector('input[id="TGDongCua"]');
    var BaiDoXeInput = document.querySelector('select[id="BaiDoXe"]');

    if (TenChiNhanhInput && MaQuanLyInput && DiaChiInput && SDTInput && TGMoCuaInput && TGDongCuaInput && BaiDoXeInput) {
        var TenChiNhanh = TenChiNhanhInput.value.trim();
        var MaQuanLy = MaQuanLyInput.value.trim();
        var DiaChi = DiaChiInput.value.trim();
        var SDT = SDTInput.value.trim();
        var TGMoCua = TGMoCuaInput.value.trim();
        var TGDongCua = TGDongCuaInput.value.trim();
        var BaiDoXe = BaiDoXeInput.value.trim();

        if (TenChiNhanh === "" || MaQuanLy === "" || DiaChi === "" || SDT === "" || TGMoCua === "" || TGDongCua === "" || BaiDoXe === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return;
        }

        var data = {
            TenChiNhanh: TenChiNhanh,
            MaQuanLy: MaQuanLy,
            DiaChi: DiaChi,
            SDT: SDT,
            TGMoCua: TGMoCua,
            TGDongCua: TGDongCua,
            BaiDoXe: BaiDoXe
        };

        createChiNhanh(data, function() {
            getChiNhanh(renderChiNhanh);
            resetForm();
        });
    }
}

function editChiNhanh(id) {
    fetch(chiNhanhAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(chinhanhs) {
            var chinhanh = chinhanhs.find(function(cn) {
                return cn.id === id;
            });

            if (chinhanh) {
                var TenChiNhanhInput = document.querySelector('input[id="TenChiNhanh"]');
                var MaQuanLyInput = document.querySelector('select[id="MaQuanLy"]');
                var DiaChiInput = document.querySelector('input[id="DiaChi"]');
                var SDTInput = document.querySelector('input[id="SDT"]');
                var TGMoCuaInput = document.querySelector('input[id="TGMoCua"]');
                var TGDongCuaInput = document.querySelector('input[id="TGDongCua"]');
                var BaiDoXeInput = document.querySelector('select[id="BaiDoXe"]');
                
                var themBtn = document.querySelector('#addPlaneButton');
                var formContainer = document.querySelector('#modalOverlay');
                var saveBtn = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3');
                var formModal = document.querySelector('.modal');

                TenChiNhanhInput.value = chinhanh.TenChiNhanh;
                MaQuanLyInput.value = chinhanh.MaQuanLy;
                DiaChiInput.value = chinhanh.DiaChi;
                SDTInput.value = chinhanh.SDT;
                TGMoCuaInput.value = chinhanh.TGMoCua;
                TGDongCuaInput.value = chinhanh.TGDongCua;
                BaiDoXeInput.value = chinhanh.BaiDoXe;

                modalTitle.textContent = 'Chỉnh sửa';
                formModal.style.backgroundColor = '#e8f5e9';

                formContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                themBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';

                saveBtn.onclick = function() {
                    var TenChiNhanh = TenChiNhanhInput.value.trim();
                    var MaQuanLy = MaQuanLyInput.value.trim();
                    var DiaChi = DiaChiInput.value.trim();
                    var SDT = SDTInput.value.trim();
                    var TGMoCua = TGMoCuaInput.value.trim();
                    var TGDongCua = TGDongCuaInput.value.trim();
                    var BaiDoXe = BaiDoXeInput.value.trim();

                    if (TenChiNhanh === "" || MaQuanLy === "" || DiaChi === "" || SDT === "" || TGMoCua === "" || TGDongCua === "" || BaiDoXe === "") {
                        alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
                        return;
                    }

                    var updatedChiNhanh = {
                        TenChiNhanh: TenChiNhanh,
                        MaQuanLy: MaQuanLy,
                        DiaChi: DiaChi,
                        SDT: SDT,
                        TGMoCua: TGMoCua,
                        TGDongCua: TGDongCua,
                        BaiDoXe: BaiDoXe
                    };

                    updateChiNhanh(id, updatedChiNhanh, function() {
                        getChiNhanh(renderChiNhanh);
                        resetForm();

                        modalTitle.textContent = 'Thêm Chi Nhánh';
                        saveBtn.style.display = 'none';
                        themBtn.style.display = 'inline-block';
                        formContainer.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        })
        .catch(error => console.error('Error editing chinhanh:', error));
}



document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchChiNhanh(searchTerm);
        } else {
            getChiNhanh(renderChiNhanh); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });

    // Tìm kiếm ngay khi người dùng gõ (khi ô tìm kiếm trống sẽ hiện lại toàn bộ)
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getChiNhanh(renderChiNhanh); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });
});

function searchChiNhanh(searchTerm) {
    fetch(chiNhanhAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(branches) {
            const filteredBranches = branches.filter(function(branch) {
                const id = branch.id.toLowerCase();
                const tenChiNhanh = branch.TenChiNhanh.toLowerCase();
                return id.includes(searchTerm) || tenChiNhanh.includes(searchTerm);
            });
            renderChiNhanh(filteredBranches);
        })
        .catch(error => console.error('Error searching chinhanh:', error));
}
