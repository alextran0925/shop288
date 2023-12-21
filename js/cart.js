let carts = [];
let lst = {};

/*
    Tivi: 1
    Mobile: 2 
    Food: 3
*/
const openCart = () => {
    if (sessionStorage.getItem("carts") != undefined) {
        window.location = `../cart/`
    }
}

const xoaGiohang = (maSo) => {
    let vt = carts.findIndex(x => x.maso == maSo)
    carts.splice(vt, 1)
    if (carts.length > 0) {
        sessionStorage.setItem("carts", JSON.stringify(carts))
        xuatSanphamMua(carts, thGiohangMua)
    } else {
        sessionStorage.removeItem('carts');
        window.history.back();
    }
}
const soLuong = (maSo, inputSL) => {
    let soLuongThay = inputSL.value;
    //console.log(`${maSo} - ${soLuong}`);
    let dt = carts.find(x => x.maso == maSo);
    dt.soluong = Number(soLuongThay);
    sessionStorage.setItem("carts", JSON.stringify(carts));
    let thanhTien = Number(soLuongThay) * Number(dt.dongiaban);
    document.getElementById(`tt${maSo}`).innerHTML=`${thanhTien.toLocaleString()}<sup>đ</sup>`;
    tongThanhtien();
/*    let soLuongThay = inputSL.value
    //console.log(`${maSo} -  ${soLuongThay}`);
    
    let dt = carts.find(x => x.maso == maSo)
    dt.soluong = Number(soLuongThay)
    sessionStorage.setItem("carts", JSON.stringify(carts))
    
    let thanhTien = Number(soLuongThay) * Number(dt.dongiaban)
    document.getElementById(`tt${maSo}`).innerHTML=`${thanhTien.toLocaleString()}<sup>đ</sup>`
    tongThanhtien()
*/
}

const tongThanhtien = () => {
    let tong = 0
    carts = JSON.parse(sessionStorage.getItem("carts"))
    carts.forEach(item => {
        tong += Number(item.soluong) * Number(item.dongiaban);
    })
    Th_Tong.innerHTML = `Tổng thành tiền: ${tong.toLocaleString()}<sup>đ</sup>`
}

const xuatSanphamMua = (carts=[],Tag ) => {
    let html = ``
    carts.forEach(item => {
        let thanhTien = item.soluong * item.dongiaban
        html += `
        <tr class="text-nowrap">
            <td scope="row" style="width: 20%;">
                <img class="img-fluid"
                    src="${urlImage}/${item.maso}.png"
                    alt="">
            </td>
            <td>
                ${item.ten}
            </td>
            <td>
                <input type="number" min="1" max="10" value="${item.soluong}" onchange="soLuong('${item.maso}',this)">
            </td>
            <td class="text-right">
                ${item.dongiaban.toLocaleString()}<sup>đ</sup>
            </td>
            <td class="text-right" id="tt${item.maso}">
                ${thanhTien.toLocaleString()}<sup>đ</sup>
            </td>
            <td class="text-center">
                <a href="javascript:void(0)" onclick="xoaGiohang('${item.maso}')" class="btn btn-sm btn-outline-danger">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                </a>
            </td>
        </tr>
        `
    })
    html += `
    <tr class="text-nowrap text-right">
    <td scope="row" colspan="6">
        <div class="tongThanhtien" id="Th_Tong"></div>
    </td>
</tr>
    `
    Tag.innerHTML = html
    tongThanhtien()

}

const addToCart = (key, nhom) => {
    console.log(lst);
    let result=(nhom==1)?lst.Tivi:(nhom==2)?lst.Mobile:lst.Food;
    let maso = key;
    let value = 1;
    let vt = -1;
    //console.log(` Mã số:${maso} - Nhóm:${nhom} - số lượng:${value}`);
    // Lưu vào sessionStorage 

        if (sessionStorage.getItem("carts") != undefined) {
            carts = JSON.parse(sessionStorage.getItem("carts"))
            vt = carts.findIndex(item => item.maso == key);
        }
    
        if (vt == -1) {
            let tmp = result.find(x => x.Ma_so == key);
            let cart = {
                maso: key,
                soluong: value,
                ten: tmp.Ten,
                dongiaban: Number(tmp.Don_gia_Ban),
                nhom: nhom
            }
    
            carts.push(cart) // Thêm
        } else {
            //carts.splice(vt, 1) // Xóa
            carts[vt].soluong += value // Cập nhật lại số lượng
        }
    
    
        if (carts.length > 0) {
            sessionStorage.setItem("carts", JSON.stringify(carts))
        } else {
            sessionStorage.removeItem("carts")
        }
        Th_Gio_hang.innerHTML = carts.length;
}
const datHang = () => {
    let dsDonHang = [];
    carts = JSON.parse(sessionStorage.getItem("carts"));
    let Khach_hang = {
        "Ho_ten": document.querySelector("#Th_Ho_ten").value,
        "Dien_thoai": document.querySelector("#Th_Dien_thoai").value,
        "Email": document.querySelector("#Th_Email").value,
        "Dia_chi": document.querySelector("#Th_Dia_chi").value
    }

    carts.forEach(item => {
        let donDathang = {
            "Ngay_Dat_hang": new Date().toLocaleDateString(),
            "Ngay_Giao_hang": document.querySelector("#Th_Ngay_Giao_hang").value,
            "So_luong": Number(item.soluong),
            "Don_gia_Ban": Number(item.dongiaban),
            "Tien": Number(item.soluong) * Number(item.dongiaban),
            "Trang_thai": "CHUA_GIAO_HANG",
            "Khach_hang": Khach_hang
        };
        let maso = item.maso;
        let donhang = {
            nhom:item.nhom,
            key: maso,
            dathang: donDathang
        }
        dsDonHang.push(donhang);
        console.log(dsDonHang);
    })
    apiDathang(dsDonHang).then(result=>{
        console.log(result);
        alert('Đơn đặt hàng thành công...');
        sessionStorage.removeItem('carts');
        window.history.back();
    }).catch(err=>{
        console.log(err);
    })
}

