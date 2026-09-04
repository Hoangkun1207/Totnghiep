/* ================= CONFIG ================= */
const STORE_KEY="hoangkun_store_data";
const state={
    cart:JSON.parse(localStorage.getItem("hk_cart")||"[]"),
    wishlist:JSON.parse(localStorage.getItem("hk_wishlist")||"[]"),
    users:JSON.parse(localStorage.getItem("hk_users")||"[]"),
    currentUser:JSON.parse(localStorage.getItem("hk_current_user")||"null")
};

const products=[
    {id:1,name:"Galaxy Ultra X Pro",price:24990000,oldPrice:29990000,category:"SMARTPHONE",icon:"📱"},
    {id:2,name:"Air Sound Pro Max",price:3490000,oldPrice:0,category:"AUDIO",icon:"🎧"},
    {id:3,name:"Gaming Laptop RGB X",price:32990000,oldPrice:0,category:"GAMING",icon:"💻"},
    {id:4,name:"Smart Watch Infinity",price:4990000,oldPrice:5890000,category:"WEARABLE",icon:"⌚"}
];

/* ================= SELECTORS ================= */
const $=selector=>document.querySelector(selector); const $$=selector=>document.querySelectorAll(selector);

const cartCount=$("#cartCount");
const wishCount=$("#wishCount");
const cartPanelCount=$("#cartPanelCount");
const wishlistPanelCount=$("#wishlistPanelCount");
const cartItems=$("#cartItems");
const wishlistItems=$("#wishlistItems");
const cartTotal=$("#cartTotal");
const checkoutSubtotal=$("#checkoutSubtotal");
const checkoutTotal=$("#checkoutTotal");

/* ================= FORMAT MONEY ================= */
function formatMoney(number){
    return new Intl.NumberFormat("vi-VN").format(number)+"₫";
}

/* ================= SAVE DATA ================= */
function saveData(){
    localStorage.setItem("hk_cart",JSON.stringify(state.cart));
    localStorage.setItem("hk_wishlist",JSON.stringify(state.wishlist));
    localStorage.setItem("hk_users",JSON.stringify(state.users));
    localStorage.setItem("hk_current_user",JSON.stringify(state.currentUser));
}

/* ================= TOAST ================= */
function showToast(title,message,type="success"){
    const container=$("#toastContainer");
    const toast=document.createElement("div");
    const icon=type==="success"?"✓":type==="error"?"!":"i";

    toast.className=`toast ${type}`;
    toast.innerHTML=`
        <div class="toast-icon">${icon}</div>
        <div class="toast-text">
            <b>${title}</b>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(()=>{
        toast.style.opacity="0";
        toast.style.transform="translateX(50px)";
        setTimeout(()=>toast.remove(),300);
    },3500);
}

/* ================= MODAL ================= */
function openModal(id){
    const modal=$("#"+id);
    if(!modal)return;
    modal.classList.add("active");
    document.body.style.overflow="hidden";
}

function closeModal(id){
    const modal=$("#"+id);
    if(!modal)return;
    modal.classList.remove("active");

    const anyModal=$$(".modal.active").length;     const anyPanel=$$(".side-panel.active").length;

    if(!anyModal&&!anyPanel){
        document.body.style.overflow="";
    }
}

$$("[data-close]").forEach(button=>{     button.addEventListener("click",()=>{         closeModal(button.dataset.close);     }); });  $$
(".modal").forEach(modal=>{
    modal.addEventListener("click",e=>{
        if(e.target===modal){
            closeModal(modal.id);
        }
    });
});

/* ================= SIDE PANEL ================= */
function openPanel(id){
    $("#"+id).classList.add("active");
    document.body.style.overflow="hidden";
}

function closePanel(id){
    $("#"+id).classList.remove("active");

    if(!$$(".modal.active").length&&!$$(".side-panel.active").length){
        document.body.style.overflow="";
    }
}

/* ================= CART ================= */
function addToCart(productId){
    const product=products.find(item=>item.id===Number(productId));

    if(!product)return;

    const existing=state.cart.find(item=>item.id===product.id);

    if(existing){
        existing.qty++;
    }else{
        state.cart.push({...product,qty:1});
    }

    saveData();
    renderCart();
    showToast("Đã thêm vào giỏ hàng",product.name);
}

function changeQuantity(productId,amount){
    const item=state.cart.find(item=>item.id===Number(productId));

    if(!item)return;

    item.qty+=amount;

    if(item.qty<=0){
        state.cart=state.cart.filter(item=>item.id!==Number(productId));
    }

    saveData();
    renderCart();
}

function removeCartItem(productId){
    state.cart=state.cart.filter(item=>item.id!==Number(productId));
    saveData();
    renderCart();
    showToast("Đã xóa sản phẩm","Sản phẩm đã được xóa khỏi giỏ hàng","info");
}

function renderCart(){
    const totalQty=state.cart.reduce((sum,item)=>sum+item.qty,0);
    const total=state.cart.reduce((sum,item)=>sum+item.price*item.qty,0);

    cartCount.textContent=totalQty;
    cartPanelCount.textContent=`(${totalQty})`;
    cartTotal.textContent=formatMoney(total);
    checkoutSubtotal.textContent=formatMoney(total);
    checkoutTotal.textContent=formatMoney(total);

    if(!state.cart.length){
        cartItems.innerHTML=`
            <div class="empty-state">
                <div>🛒</div>
                <h3>Giỏ hàng đang trống</h3>
                <p>Hãy thêm sản phẩm yêu thích của bạn.</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML=state.cart.map(item=>`
        <div class="cart-item">
            <div class="cart-item-icon">${item.icon}</div>

            <div class="cart-item-info">
                <b>${item.name}</b>
                <strong>${formatMoney(item.price)}</strong>

                <div class="cart-actions">
                    <div class="qty-box">
                        <button class="qty-btn" onclick="changeQuantity(${item.id},-1)">−</button>
                        <span class="qty-number">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id},1)">+</button>
                    </div>

                    <button class="remove-item" onclick="removeCartItem(${item.id})">×</button>
                </div>
            </div>
        </div>
    `).join("");
}

/* ================= WISHLIST ================= */
function toggleWishlist(productId){
    const product=products.find(item=>item.id===Number(productId));

    if(!product)return;

    const index=state.wishlist.findIndex(item=>item.id===product.id);

    if(index>-1){
        state.wishlist.splice(index,1);
        showToast("Đã bỏ yêu thích",product.name,"info");
    }else{
        state.wishlist.push(product);
        showToast("Đã thêm yêu thích",product.name);
    }

    saveData();
    renderWishlist();
    updateHeartButtons();
}

function removeWishlistItem(productId){
    state.wishlist=state.wishlist.filter(item=>item.id!==Number(productId));
    saveData();
    renderWishlist();
    updateHeartButtons();
}

function renderWishlist(){
    const count=state.wishlist.length;

    wishCount.textContent=count;
    wishlistPanelCount.textContent=`(${count})`;

    if(!count){
        wishlistItems.innerHTML=`
            <div class="empty-state">
                <div>♡</div>
                <h3>Chưa có sản phẩm</h3>
                <p>Nhấn biểu tượng trái tim để lưu sản phẩm.</p>
            </div>
        `;
        return;
    }

    wishlistItems.innerHTML=state.wishlist.map(item=>`
        <div class="wishlist-item">
            <div class="cart-item-icon">${item.icon}</div>

            <div class="wishlist-info">
                <b>${item.name}</b>
                <span>${formatMoney(item.price)}</span>
            </div>

            <div class="wishlist-actions">
                <button class="small-action" onclick="addToCart(${item.id})">🛒</button>
                <button class="small-action" onclick="removeWishlistItem(${item.id})">×</button>
            </div>
        </div>
    `).join("");
}

function updateHeartButtons(){
    $$(".product-card").forEach(card=>{         const id=Number(card.dataset.id);         const button=card.querySelector(".product-heart");          if(!button)return;          const active=state.wishlist.some(item=>item.id===id);          button.textContent=active?"♥":"♡";         button.style.color=active?"var(--pink)":"";     }); }  /* ================= PRODUCT BUTTONS ================= */ $$
(".product-card").forEach(card=>{
    const id=Number(card.dataset.id);

    card.querySelector(".add-cart").addEventListener("click",e=>{
        e.stopPropagation();
        addToCart(id);
    });

    card.querySelector(".product-heart").addEventListener("click",e=>{
        e.stopPropagation();
        toggleWishlist(id);
    });
});

/* ================= CART PANEL ================= */
$("#cartBtn").addEventListener("click",()=>{
    renderCart();
    openPanel("cartPanel");
});

$("#closeCart").addEventListener("click",()=>{
    closePanel("cartPanel");
});

$("#heartBtn").addEventListener("click",()=>{
    renderWishlist();
    openPanel("wishlistPanel");
});

$("#closeWishlist").addEventListener("click",()=>{
    closePanel("wishlistPanel");
});

/* ================= CHECKOUT ================= */
$("#checkoutBtn").addEventListener("click",()=>{
    if(!state.cart.length){
        showToast("Giỏ hàng trống","Hãy thêm sản phẩm trước khi thanh toán","error");
        return;
    }

    closePanel("cartPanel");

    if(!state.currentUser){
        showToast("Cần đăng nhập","Vui lòng đăng nhập trước khi thanh toán","error");
        openModal("authModal");
        showAuthPanel("loginPanel");
        return;
    }

    $("#checkoutName").value=state.currentUser.name||"";
    $("#checkoutPhone").value=state.currentUser.phone||"";

    openModal("checkoutModal");
});

$("#checkoutForm").addEventListener("submit",e=>{     e.preventDefault();      if(!state.cart.length){         showToast("Lỗi","Không có sản phẩm để thanh toán","error");         return;     }      const order={         id:"HK"+Date.now(),         user:state.currentUser.email,         products:state.cart,         total:state.cart.reduce((sum,item)=>sum+item.price*item.qty,0),         date:new Date().toLocaleString("vi-VN"),         status:"Đang xử lý"     };      const orders=JSON.parse(localStorage.getItem("hk_orders")\vert{}\vert{}"[]");     orders.push(order);     localStorage.setItem("hk_orders",JSON.stringify(orders));      state.cart=[];     saveData();     renderCart();      closeModal("checkoutModal");     showToast("Đặt hàng thành công!","Mã đơn hàng: "+order.id);      setTimeout(()=>{         alert("Cảm ơn bạn đã mua hàng!\nMã đơn: "+order.id);     },400); });  /* ================= AUTH ================= */ function showAuthPanel(panelId){     $$(".auth-panel").forEach(panel=>{
        panel.classList.remove("active");
    });

    $("#"+panelId).classList.add("active"); }  $$(".openAuth").forEach(button=>{
    button.addEventListener("click",e=>{
        e.preventDefault();
        $("#mobileNav").classList.remove("active");

        if(state.currentUser){
            showToast("Xin chào "+state.currentUser.name,"Bạn đã đăng nhập tài khoản","info");
        }else{
            showAuthPanel("loginPanel");
            openModal("authModal");
        }
    });
});

$("#goRegister").addEventListener("click",()=>{
    showAuthPanel("registerPanel");
});

$("#goLogin").addEventListener("click",()=>{
    showAuthPanel("loginPanel");
});

$("#forgotLink").addEventListener("click",()=>{
    showAuthPanel("forgotPanel");
});

$("#backLogin").addEventListener("click",()=>{
    showAuthPanel("loginPanel");
});

/* ================= REGISTER ================= */
$("#registerForm").addEventListener("submit",e=>{
    e.preventDefault();

    const name=$("#regName").value.trim();
    const email=$("#regEmail").value.trim().toLowerCase();
    const phone=$("#regPhone").value.trim();
    const password=$("#regPass").value;

    if(state.users.some(user=>user.email===email)){
        showToast("Không thể đăng ký","Email này đã tồn tại","error");
        return;
    }

    const user={
        id:Date.now(),
        name,
        email,
        phone,
        password,
        createdAt:new Date().toLocaleString("vi-VN")
    };

    state.users.push(user);
    state.currentUser=user;

    saveData();

    $("#registerForm").reset();
    closeModal("authModal");

    showToast("Đăng ký thành công!","Chào mừng "+name+" đến HOANGKUN STORE");
    updateUserInterface();
});

/* ================= LOGIN ================= */
$("#loginForm").addEventListener("submit",e=>{
    e.preventDefault();

    const username=$("#loginUser").value.trim().toLowerCase();
    const password=$("#loginPass").value;

    const user=state.users.find(user=>
        (user.email.toLowerCase()===username||user.phone===username)&&
        user.password===password
    );

    if(!user){
        showToast("Đăng nhập thất bại","Sai tài khoản hoặc mật khẩu","error");
        return;
    }

    state.currentUser=user;
    saveData();

    $("#loginForm").reset();
    closeModal("authModal");

    showToast("Đăng nhập thành công!","Xin chào "+user.name);
    updateUserInterface();
});

/* ================= FORGOT PASSWORD ================= */
$("#forgotForm").addEventListener("submit",e=>{
    e.preventDefault();

    const email=$("#forgotEmail").value.trim().toLowerCase();

    const user=state.users.find(user=>user.email.toLowerCase()===email);

    if(!user){
        showToast("Không tìm thấy tài khoản","Email chưa được đăng ký","error");
        return;
    }

    $("#forgotForm").reset();

    showToast(
        "Yêu cầu đã được gửi",
        "Đây là bản demo, mật khẩu của bạn không được gửi qua email.",
        "info"
    );

    showAuthPanel("loginPanel");
});

/* ================= SHOW PASSWORD ================= */
$$(".show-pass").forEach(button=>{     button.addEventListener("click",()=>{         const input=button.parentElement.querySelector("input");          if(input.type==="password"){             input.type="text";             button.textContent="◉";         }else{             input.type="password";             button.textContent="◉";         }     }); });  /* ================= USER INTERFACE ================= */ function updateUserInterface(){     const authButtons=$$
(".openAuth");

    authButtons.forEach(button=>{
        if(state.currentUser){
            button.innerHTML="👤 "+state.currentUser.name.split(" ")[0];
        }
    });
}

/* ================= SEARCH MODAL (HEADER) ================= */
$("#searchBtn").addEventListener("click",()=>{
    $("#searchInput").value="";
    $("#searchResults").innerHTML=`
        <p class="empty-text">Nhập tên sản phẩm để bắt đầu tìm kiếm.</p>
    `;
    openModal("searchModal");

    setTimeout(()=>$("#searchInput").focus(),300);
});

$("#searchInput").addEventListener("input",function(){
    const keyword=this.value.trim().toLowerCase();

    if(!keyword){
        $("#searchResults").innerHTML=`
            <p class="empty-text">Nhập tên sản phẩm để bắt đầu tìm kiếm.</p>
        `;
        return;
    }

    const result=products.filter(product=>
        product.name.toLowerCase().includes(keyword)||
        product.category.toLowerCase().includes(keyword)
    );

    if(!result.length){
        $("#searchResults").innerHTML=`
            <p class="empty-text">Không tìm thấy sản phẩm phù hợp.</p>
        `;
        return;
    }

    $("#searchResults").innerHTML=result.map(product=>`
        <div class="search-result-item">
            <div class="search-result-left">
                <div class="search-result-icon">${product.icon}</div>
                <div>
                    <b>${product.name}</b>
                    <span>${product.category} • ${formatMoney(product.price)}</span>
                </div>
            </div>
            <button class="small-action" onclick="addToCart(${product.id})">🛒</button>
        </div>
    `).join("");
});

/* ================= DARK MODE ================= */
$("#themeBtn").addEventListener("click",()=>{
    document.body.classList.toggle("light");

    const isLight=document.body.classList.contains("light");

    localStorage.setItem("hk_theme",isLight?"light":"dark");

    $("#themeBtn").textContent=isLight?"☀":"◐";
});

function loadTheme(){
    if(localStorage.getItem("hk_theme")==="light"){
        document.body.classList.add("light");
        $("#themeBtn").textContent="☀";
    }
}

/* ================= MOBILE MENU ================= */
$("#mobileMenu").addEventListener("click",()=>{
    $("#mobileNav").classList.toggle("active");
});

$$(".mobile-nav a").forEach(link=>{
    link.addEventListener("click",()=>{
        $("#mobileNav").classList.remove("active");
    });
});

/* ================= INTRO ================= */
$("#openIntro").addEventListener("click",()=>{
    openModal("introModal");
});

$("#aboutBtn").addEventListener("click",()=>{
    openModal("introModal");
});

/* ================= NEWSLETTER ================= */
$("#newsletterForm").addEventListener("submit",e=>{
    e.preventDefault();

    const email=$("#newsletterEmail").value.trim();

    if(!email){
        showToast("Chưa nhập email","Vui lòng nhập email của bạn","error");
        return;
    }

    const subscribers=JSON.parse(
        localStorage.getItem("hk_subscribers")||"[]"
    );

    if(subscribers.includes(email)){
        showToast("Email đã đăng ký","Bạn đã nhận thông báo từ chúng tôi","info");
        return;
    }

    subscribers.push(email);

    localStorage.setItem(
        "hk_subscribers",
        JSON.stringify(subscribers)
    );

    $("#newsletterForm").reset();

    showToast(
        "Đăng ký thành công!",
        "Bạn sẽ nhận được thông tin ưu đãi mới nhất."
    );
});

/* ================= COUNTDOWN ================= */
let countdownSeconds=(12*60*60)+(45*60)+30;

function updateCountdown(){
    if(countdownSeconds<0){
        countdownSeconds=(23*60*60)+(59*60)+59;
    }

    const hours=Math.floor(countdownSeconds/3600);
    const minutes=Math.floor((countdownSeconds%3600)/60);
    const seconds=countdownSeconds%60;

    $("#hours").textContent=String(hours).padStart(2,"0");
    $("#minutes").textContent=String(minutes).padStart(2,"0");
    $("#seconds").textContent=String(seconds).padStart(2,"0");

    countdownSeconds--;
}

updateCountdown();
setInterval(updateCountdown,1000);

/* ================= SCROLL HEADER ================= */
function handleScroll(){
    const scrollY=window.scrollY;

    $("#header").classList.toggle("scrolled",scrollY>40);
    $("#backTop").classList.toggle("show",scrollY>500);
}

window.addEventListener("scroll",handleScroll);
handleScroll();

/* ================= BACK TO TOP ================= */
$("#backTop").addEventListener("click",()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});

/* ================= SCROLL REVEAL ================= */
const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
        }
    });
},{
    threshold:.12
});

$$(".reveal").forEach(element=>{
    revealObserver.observe(element);
});

/* ================= COUNTER ================= */
function animateCounter(element){
    const target=Number(element.dataset.target);
    const duration=1800;
    const startTime=performance.now();

    function update(now){
        const progress=Math.min((now-startTime)/duration,1);
        const value=Math.floor(target*(1-Math.pow(1-progress,3)));

        element.textContent=value.toLocaleString("vi-VN")+
            (target===99?"%":"+");

        if(progress<1){
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const counterObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
},{
    threshold:.7
});

$$(".counter").forEach(counter=>{
    counterObserver.observe(counter);
});

/* ================= PARTICLES ================= */
function createParticles(){
    const container=$("#particles");

    for(let i=0;i<55;i++){
        const particle=document.createElement("span");

        particle.className="particle";

        particle.style.left=Math.random()*100+"%";
        particle.style.animationDuration=(8+Math.random()*15)+"s";
        particle.style.animationDelay=(-Math.random()*20)+"s";
        particle.style.opacity=.1+Math.random()*.5;
        particle.style.transform=`scale(${.5+Math.random()*1.5})`;

        container.appendChild(particle);
    }
}

/* ================= CURSOR GLOW ================= */
document.addEventListener("mousemove",e=>{
    const glow=$("#cursorGlow");

    if(window.innerWidth<760)return;

    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
});

/* ================= PRODUCT TILT ================= */
$$(".product-card").forEach(card=>{
    card.addEventListener("mousemove",e=>{
        if(window.innerWidth<900)return;

        const rect=card.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;

        const rotateY=((x/rect.width)-.5)*8;
        const rotateX=((y/rect.height)-.5)*-8;

        card.style.transform=
            `translateY(-9px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave",()=>{
        card.style.transform="";
    });
});

/* ================= REVIEW SLIDER ================= */
let reviewPosition=0;

$("#reviewNext").addEventListener("click",()=>{
    const slider=$("#reviewSlider");
    const cards=slider.querySelectorAll(".review-card");

    if(window.innerWidth>760){
        reviewPosition=(reviewPosition+1)%cards.length;
        slider.scrollTo({
            left:reviewPosition*320,
            behavior:"smooth"
        });
    }else{
        slider.scrollBy({
            left:320,
            behavior:"smooth"
        });
    }
});

$("#reviewPrev").addEventListener("click",()=>{
    const slider=$("#reviewSlider");

    slider.scrollBy({
        left:-320,
        behavior:"smooth"
    });
});

/* ================= SHOW ALL PRODUCTS ================= */
$("#showAllProducts").addEventListener("click",()=>{
    const extraProducts=[
        {id:5,name:"Mechanical Keyboard Pro",price:2490000,category:"GAMING",icon:"⌨️"},
        {id:6,name:"Gaming Mouse Ultra",price:1290000,category:"ACCESSORY",icon:"🖱️"},
        {id:7,name:"Premium Sneaker X",price:2990000,category:"FASHION",icon:"👟"},
        {id:8,name:"Portable Speaker Bass",price:1890000,category:"AUDIO",icon:"🔊"}
    ];

    const newProducts=extraProducts.filter(
        product=>!products.some(item=>item.id===product.id)
    );

    if(!newProducts.length){
        showToast("Đã hiển thị tất cả","Không còn sản phẩm mới để tải","info");
        return;
    }

    products.push(...newProducts);

    $("#productGrid").insertAdjacentHTML(
        "beforeend",
        newProducts.map(product=>`
            <article class="product-card reveal show"
                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${product.price}">
                <div class="product-image">
                    <span class="sale-tag">NEW</span>
                    <button class="icon-btn product-heart">♡</button>
                    <div class="product-art">${product.icon}</div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="rating">★★★★★ <em>(Mới)</em></div>
                    <div class="product-bottom">
                        <div class="price">
                            <strong>${formatMoney(product.price)}</strong>
                        </div>
                        <button class="add-cart">+</button>
                    </div>
                </div>
            </article>
        `).join("")
    );

    bindNewProductButtons();

    $("#showAllProducts").textContent="Đã tải sản phẩm ✓";

    showToast(
        "Đã tải thêm sản phẩm",
        "4 sản phẩm mới đã được hiển thị."
    );
});

function bindNewProductButtons(){
    $$(".product-card").forEach(card=>{
        if(card.dataset.bound)return;

        card.dataset.bound="true";

        const id=Number(card.dataset.id);
        const addButton=card.querySelector(".add-cart");
        const heartButton=card.querySelector(".product-heart");

        addButton.addEventListener("click",e=>{
            e.stopPropagation();
            addToCart(id);
        });

        heartButton.addEventListener("click",e=>{
            e.stopPropagation();
            toggleWishlist(id);
        });
    });

    updateHeartButtons();
}

/* ================= ESC CLOSE ================= */
document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
        $$(".modal.active").forEach(modal=>{
            closeModal(modal.id);
        });

        $$(".side-panel.active").forEach(panel=>{
            closePanel(panel.id);
        });

        $("#mobileNav").classList.remove("active");
    }
});

/* ================= PAGE LOADER ================= */
window.addEventListener("load",()=>{
    setTimeout(()=>{
        $("#loader").classList.add("hide");
    },900);
});

/* ================= INIT ================= */
function initStore(){
    loadTheme();
    renderCart();
    renderWishlist();
    updateHeartButtons();
    updateUserInterface();
    createParticles();
    bindNewProductButtons();

    console.log(
        "%cHOANGKUN STORE",
        "color:#00d4ff;font-size:22px;font-weight:bold"
    );

    console.log("Premium Shopping Experience Loaded ✓");
}

initStore();

    /* ================= PART 6 - PREMIUM FEATURES ================= */

/* ================= COPY VOUCHER ================= */
function copyVoucher(code){
    if(navigator.clipboard){
        navigator.clipboard.writeText(code)
            .then(()=>{
                showToast("Đã sao chép voucher",code+" đã được lưu vào clipboard");
            })
            .catch(()=>{
                fallbackCopyVoucher(code);
            });
    }else{
        fallbackCopyVoucher(code);
    }
}

function fallbackCopyVoucher(code){
    const input=document.createElement("textarea");
    input.value=code;
    input.style.position="fixed";
    input.style.opacity="0";
    document.body.appendChild(input);
    input.select();

    try{
        document.execCommand("copy");
        showToast("Đã sao chép voucher",code+" đã được lưu vào clipboard");
    }catch(error){
        showToast("Voucher",code,"info");
    }

    input.remove();
}

/* ================= ACCOUNT PANEL ================= */
function openAccountPanel(){
    renderAccount();
    openPanel("accountPanel");
}

function renderAccount(){
    const accountBody=$("#accountBody");

    if(!state.currentUser){
        $("#accountTitle").textContent="Tài khoản của bạn";

        accountBody.innerHTML=`
            <div class="account-user-card">
                <div class="account-big-avatar">?</div>
                <h3>Bạn chưa đăng nhập</h3>
                <p>Đăng nhập để quản lý đơn hàng và nhận ưu đãi.</p>
            </div>

            <div class="account-menu">
                <button onclick="openLoginFromAccount()">
                    <span>🔐</span>
                    Đăng nhập tài khoản
                </button>

                <button onclick="openRegisterFromAccount()">
                    <span>✨</span>
                    Tạo tài khoản mới
                </button>
            </div>
        `;

        return;
    }

    const user=state.currentUser;
    const firstLetter=user.name
        ?user.name.trim().charAt(0).toUpperCase()
        :"H";

    $("#accountTitle").textContent="Xin chào, "+user.name.split(" ")[0];

    accountBody.innerHTML=`
        <div class="account-user-card">
            <div class="account-big-avatar">${firstLetter}</div>
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>${user.phone||"Chưa cập nhật số điện thoại"}</p>
        </div>

        <div class="account-menu">
            <button onclick="showOrderHistory()">
                <span>📦</span>
                Đơn hàng của tôi
            </button>

            <button onclick="showAccountProfile()">
                <span>👤</span>
                Thông tin tài khoản
            </button>

            <button onclick="showAccountWishlist()">
                <span>♡</span>
                Sản phẩm yêu thích
            </button>

            <button onclick="logoutUser()">
                <span>🚪</span>
                Đăng xuất
            </button>
        </div>
    `;
}

function openLoginFromAccount(){
    closePanel("accountPanel");
    showAuthPanel("loginPanel");
    openModal("authModal");
}

function openRegisterFromAccount(){
    closePanel("accountPanel");
    showAuthPanel("registerPanel");
    openModal("authModal");
}

function showAccountProfile(){
    if(!state.currentUser)return;

    const accountBody=$("#accountBody");
    const user=state.currentUser;

    $("#accountTitle").textContent="Thông tin cá nhân";

    accountBody.innerHTML=`
        <form id="profileForm" class="profile-form">
            <div class="form-group">
                <label>Họ và tên</label>
                <input
                    type="text"
                    id="profileName"
                    value="${user.name||""}"
                    required
                >
            </div>

            <div class="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value="${user.email||""}"
                    disabled
                >
            </div>

            <div class="form-group">
                <label>Số điện thoại</label>
                <input
                    type="text"
                    id="profilePhone"
                    value="${user.phone||""}"
                >
            </div>

            <button type="submit" class="btn btn-primary">
                Lưu thay đổi
            </button>

            <button
                type="button"
                class="btn"
                onclick="renderAccount()"
            >
                ← Quay lại
            </button>
        </form>
    `;

    $("#profileForm").addEventListener("submit",e=>{
        e.preventDefault();

        const name=$("#profileName").value.trim();
        const phone=$("#profilePhone").value.trim();

        if(!name){
            showToast(
                "Thiếu thông tin",
                "Vui lòng nhập họ tên",
                "error"
            );
            return;
        }

        state.currentUser.name=name;
        state.currentUser.phone=phone;

        const userIndex=state.users.findIndex(
            item=>item.id===state.currentUser.id
        );

        if(userIndex!==-1){
            state.users[userIndex]=state.currentUser;
        }

        saveData();
        updateUserInterface();
        renderAccount();

        showToast(
            "Cập nhật thành công",
            "Thông tin tài khoản đã được lưu"
        );
    });
}

function showAccountWishlist(){
    $("#accountTitle").textContent="Sản phẩm yêu thích";

    const accountBody=$("#accountBody");

    if(!state.wishlist.length){
        accountBody.innerHTML=`
            <div class="empty-state">
                <div>♡</div>
                <h3>Chưa có sản phẩm yêu thích</h3>
                <p>Hãy khám phá thêm sản phẩm nhé.</p>

                <button
                    class="btn btn-primary"
                    onclick="renderAccount()"
                >
                    ← Quay lại
                </button>
            </div>
        `;

        return;
    }

    accountBody.innerHTML=`
        <div class="account-products">
            ${state.wishlist.map(item=>`
                <div class="account-product">
                    <div class="account-product-icon">
                        ${item.icon}
                    </div>

                    <div class="account-product-info">
                        <b>${item.name}</b>
                        <span>${formatMoney(item.price)}</span>
                    </div>

                    <button
                        class="small-action"
                        onclick="addToCart(${item.id})"
                    >
                        🛒
                    </button>
                </div>
            `).join("")}
        </div>

        <button
            class="btn"
            style="margin-top:15px"
            onclick="renderAccount()"
        >
            ← Quay lại
        </button>
    `;
}

/* ================= ORDER HISTORY ================= */
function showOrderHistory(){
    if(!state.currentUser)return;

    $("#accountTitle").textContent="Đơn hàng của tôi";

    const orders=JSON.parse(
        localStorage.getItem("hk_orders")||"[]"
    );

    const userOrders=orders.filter(
        order=>order.user===state.currentUser.email
    );

    const accountBody=$("#accountBody");

    if(!userOrders.length){
        accountBody.innerHTML=`
            <div class="empty-state">
                <div>📦</div>
                <h3>Chưa có đơn hàng</h3>
                <p>Bạn chưa thực hiện đơn hàng nào.</p>

                <button
                    class="btn"
                    onclick="renderAccount()"
                >
                    ← Quay lại
                </button>
            </div>
        `;

        return;
    }

    accountBody.innerHTML=`
        <div class="order-list">
            ${userOrders.slice().reverse().map(order=>`
                <div class="order-card">
                    <div class="order-card-head">
                        <b>${order.id}</b>
                        <span class="order-status">
                            ${order.status||"Đang xử lý"}
                        </span>
                    </div>

                    <p>
                        ${order.products.length} sản phẩm
                        • ${order.date}
                    </p>

                    <strong>${formatMoney(order.total)}</strong>
                </div>
            `).join("")}
        </div>

        <button
            class="btn"
            style="margin-top:15px"
            onclick="renderAccount()"
        >
            ← Quay lại
        </button>
    `;
}

/* ================= LOGOUT ================= */
function logoutUser(){
    const name=state.currentUser
        ?state.currentUser.name
        :"";

    state.currentUser=null;
    saveData();

    renderAccount();
    updateUserInterface();

    closePanel("accountPanel");

    showToast(
        "Đã đăng xuất",
        "Hẹn gặp lại "+name+"!"
    );
}

/* ================= UPDATE USER BUTTON ================= */
const originalUpdateUserInterface=updateUserInterface;

updateUserInterface=function(){
    const authButtons=$$(".openAuth");

    authButtons.forEach(button=>{
        if(state.currentUser){
            button.innerHTML=
                "👤 "+state.currentUser.name.split(" ")[0];
            button.dataset.loggedin="true";
        }else{
            button.innerHTML="👤 Đăng nhập";
            button.dataset.loggedin="false";
        }
    });
};

/* ================= OPEN ACCOUNT WHEN LOGGED ================= */
document.addEventListener("click",e=>{
    const authButton=e.target.closest(".openAuth");

    if(
        authButton&&
        state.currentUser
    ){
        e.preventDefault();
        openAccountPanel();
    }
});

/* ================= ACCOUNT EVENTS ================= */
$("#closeAccount").addEventListener("click",()=>{
    closePanel("accountPanel");
});

/* ================= NOTIFICATION ================= */
let unreadNotifications=3;

function updateNotificationCount(){
    const number=$("#notifyNumber");
    const panelCount=$("#notifyPanelCount");

    number.textContent=unreadNotifications;
    panelCount.textContent=
        "("+unreadNotifications+")";

    if(unreadNotifications<=0){
        number.style.display="none";
        panelCount.textContent="(0)";
    }else{
        number.style.display="grid";
    }
}

$("#notifyBtn").addEventListener("click",()=>{
    openPanel("notifyPanel");

    unreadNotifications=0;
    updateNotificationCount();

    $$(".notification-item").forEach(item=>{
        item.classList.remove("unread");
    });
});

$("#closeNotify").addEventListener("click",()=>{
    closePanel("notifyPanel");
});

/* ================= CHAT ================= */
const chatBtn=$("#chatBtn");
const chatBox=$("#chatBox");
const closeChat=$("#closeChat");
const chatForm=$("#chatForm");
const chatInput=$("#chatInput");
const chatMessages=$("#chatMessages");

chatBtn.addEventListener("click",()=>{
    chatBox.classList.toggle("active");

    if(chatBox.classList.contains("active")){
        setTimeout(()=>{
            chatInput.focus();
        },250);
    }
});

closeChat.addEventListener("click",()=>{
    chatBox.classList.remove("active");
});

function addChatMessage(text,type="user"){
    const message=document.createElement("div");

    message.className="message "+type;

    if(type==="bot"){
        message.innerHTML=`
            <div class="message-avatar">K</div>
            <div class="message-content">${text}</div>
        `;
    }else{
        message.innerHTML=`
            <div class="message-content">${text}</div>
        `;
    }

    chatMessages.appendChild(message);

    chatMessages.scrollTo({
        top:chatMessages.scrollHeight,
        behavior:"smooth"
    });
}

function getBotReply(text){
    const message=text.toLowerCase();

    if(
        message.includes("sản phẩm")||
        message.includes("mua")
    ){
        return "Bạn có thể kéo xuống mục Sản phẩm để xem và thêm hàng vào giỏ 🛒";
    }

    if(
        message.includes("khuyến mãi")||
        message.includes("voucher")||
        message.includes("sale")
    ){
        return "Hiện tại cửa hàng có các mã WELCOME10, FLASH15 và FREESHIP 🎁";
    }

    if(
        message.includes("đơn hàng")||
        message.includes("đơn")
    ){
        return state.currentUser
            ?"Bạn có thể mở mục tài khoản để xem lịch sử đơn hàng 📦"
            :"Bạn hãy đăng nhập trước để quản lý đơn hàng nhé 🔐";
    }

    if(
        message.includes("ship")||
        message.includes("giao hàng")
    ){
        return "Đơn hàng từ 500.000₫ có thể áp dụng voucher FREESHIP 🚚";
    }

    if(
        message.includes("xin chào")||
        message.includes("chào")
    ){
        return "Xin chào 👋 Rất vui được hỗ trợ bạn!";
    }

    return "Tôi đã nhận được tin nhắn của bạn 😊 Bạn có thể hỏi về sản phẩm, voucher hoặc đơn hàng.";
}

function sendChatMessage(text){
    const message=text.trim();

    if(!message)return;

    addChatMessage(message,"user");
    chatInput.value="";

    setTimeout(()=>{
        addChatMessage(getBotReply(message),"bot");
    },500);
}

chatForm.addEventListener("submit",e=>{
    e.preventDefault();
    sendChatMessage(chatInput.value);
});

$$(".chat-quick button").forEach(button=>{
    button.addEventListener("click",()=>{
        sendChatMessage(button.dataset.chat);
    });
});

/* ================= NEW ORDER NOTIFICATION ================= */
function addOrderNotification(order){
    const notificationList=$("#notificationList");

    const notification=document.createElement("div");

    notification.className="notification-item unread";

    notification.innerHTML=`
        <div class="notification-icon">📦</div>
        <div>
            <b>Đặt hàng thành công</b>
            <p>
                Đơn hàng ${order.id} đang được xử lý.
            </p>
            <small>Vừa xong</small>
        </div>
    `;

    notificationList.prepend(notification);

    unreadNotifications++;
    updateNotificationCount();
}

/* ================= PATCH CHECKOUT ================= */
const originalCheckoutHandler=$("#checkoutForm");

if(originalCheckoutHandler){
    originalCheckoutHandler.addEventListener(
        "submit",
        ()=>{
            setTimeout(()=>{
                const orders=JSON.parse(
                    localStorage.getItem("hk_orders")||"[]"
                );

                if(orders.length){
                    addOrderNotification(
                        orders[orders.length-1]
                    );
                }
            },100);
        }
    );
}

/* ================= KEYBOARD SHORTCUTS ================= */
document.addEventListener("keydown",e=>{
    if(
        (e.ctrlKey||e.metaKey)&&
        e.key.toLowerCase()==="k"
    ){
        e.preventDefault();

        $("#searchInput").value="";
        openModal("searchModal");

        setTimeout(()=>{
            $("#searchInput").focus();
        },200);
    }
});

/* ================= WELCOME BACK ================= */
setTimeout(()=>{
    if(
        state.currentUser&&
        !sessionStorage.getItem("hk_welcome_shown")
    ){
        showToast(
            "Chào mừng trở lại 👋",
            "Xin chào "+state.currentUser.name+"!"
        );

        sessionStorage.setItem(
            "hk_welcome_shown",
            "true"
        );
    }
},1500);

/* ================= INIT PART 6 ================= */
updateNotificationCount();
renderAccount();

console.log(
    "%cPREMIUM FEATURES LOADED ✓",
    "color:#00d4ff;font-size:14px;font-weight:bold"
);

    /* ================= PART 7 - PRODUCT EXPERIENCE ================= */

const productExtra={
    1:{
        rating:"4.9",
        reviews:"1.248 đánh giá",
        description:"Thiết bị cao cấp với hiệu năng mạnh mẽ, thiết kế hiện đại và trải nghiệm sử dụng mượt mà.",
        specs:["Hiệu năng cao","Màn hình Premium","Camera AI","Pin bền bỉ"]
    },
    2:{
        rating:"4.8",
        reviews:"856 đánh giá",
        description:"Âm thanh sống động, thiết kế thoải mái và phù hợp cho giải trí mỗi ngày.",
        specs:["Âm thanh Hi-Fi","Chống ồn","Bluetooth","Pin dài lâu"]
    },
    3:{
        rating:"4.9",
        reviews:"2.036 đánh giá",
        description:"Laptop gaming mạnh mẽ dành cho chơi game, sáng tạo nội dung và công việc hiệu năng cao.",
        specs:["Gaming mạnh mẽ","RGB","Màn hình tốc độ cao","Tản nhiệt tốt"]
    },
    4:{
        rating:"4.7",
        reviews:"634 đánh giá",
        description:"Thiết bị đeo thông minh giúp theo dõi hoạt động và hỗ trợ cuộc sống hiện đại.",
        specs:["Theo dõi sức khỏe","Nhiều chế độ tập","Thông báo thông minh","Thiết kế hiện đại"]
    }
};

let recentProducts=JSON.parse(
    localStorage.getItem("hk_recent_products")||"[]"
);

function getProductExtra(productId){
    return productExtra[productId]||{
        rating:"4.8",
        reviews:"500 đánh giá",
        description:"Sản phẩm chất lượng cao với thiết kế hiện đại và trải nghiệm tuyệt vời.",
        specs:["Chất lượng cao","Thiết kế đẹp","Công nghệ mới","Bảo hành tốt"]
    };
}

/* ================= RECENT PRODUCTS ================= */

function saveRecentProduct(productId){
    recentProducts=recentProducts.filter(
        id=>Number(id)!==Number(productId)
    );

    recentProducts.unshift(Number(productId));
    recentProducts=recentProducts.slice(0,4);

    localStorage.setItem(
        "hk_recent_products",
        JSON.stringify(recentProducts)
    );

    renderRecentProducts();
}

function renderRecentProducts(){
    const container=$("#recentProducts");

    if(!container)return;

    const list=recentProducts
        .map(id=>products.find(item=>item.id===Number(id)))
        .filter(Boolean);

    if(!list.length){
        container.innerHTML=`
            <div class="recent-empty">
                👀 Hãy xem sản phẩm để lịch sử xuất hiện tại đây.
            </div>
        `;
        return;
    }

    container.innerHTML=list.map(product=>`
        <div class="recent-card" onclick="openQuickView(${product.id})">
            <div class="recent-icon">${product.icon}</div>

            <div class="recent-info">
                <b>${product.name}</b>
                <span>${formatMoney(product.price)}</span>
            </div>
        </div>
    `).join("");
}

$("#clearRecent")?.addEventListener("click",()=>{
    recentProducts=[];
    localStorage.removeItem("hk_recent_products");
    renderRecentProducts();

    showToast(
        "Đã xóa lịch sử",
        "Sản phẩm vừa xem đã được xóa",
        "info"
    );
});

/* ================= QUICK VIEW ================= */

function openQuickView(productId){
    const product=products.find(
        item=>item.id===Number(productId)
    );

    if(!product)return;

    const extra=getProductExtra(product.id);

    saveRecentProduct(product.id);

    const discount=product.oldPrice
        ?Math.round(
            (1-product.price/product.oldPrice)*100
        )
        :0;

    $("#quickViewContent").innerHTML=`
        <div class="quick-view-layout">
            <div class="quick-product-visual">
                ${discount
                    ?`<span class="sale-badge">-${discount}%</span>`
                    :""
                }

                <div class="quick-product-icon">
                    ${product.icon}
                </div>
            </div>

            <div class="quick-product-info">
                <span class="quick-category">
                    ${product.category}
                </span>

                <h2>${product.name}</h2>

                <div class="quick-rating">
                    <div class="quick-stars">★★★★★</div>
                    <span>
                        ${extra.rating} • ${extra.reviews}
                    </span>
                </div>

                <div class="quick-price">
                    <strong>
                        ${formatMoney(product.price)}
                    </strong>

                    ${product.oldPrice
                        ?`<del>${formatMoney(product.oldPrice)}</del>`
                        :""
                    }
                </div>

                <p class="quick-description">
                    ${extra.description}
                </p>

                <div class="quick-specs">
                    ${extra.specs.map((spec,index)=>`
                        <div class="quick-spec">
                            <span>
                                ${["TÍNH NĂNG","CÔNG NGHỆ","TRẢI NGHIỆM","BẢO HÀNH"][index]}
                            </span>
                            <b>${spec}</b>
                        </div>
                    `).join("")}
                </div>

                <div class="quick-actions">
                    <button
                        class="btn btn-primary"
                        onclick="quickAddToCart(${product.id})"
                    >
                        🛒 Thêm vào giỏ
                    </button>

                    <button
                        class="btn"
                        onclick="quickToggleWishlist(${product.id})"
                    >
                        ♡ Yêu thích
                    </button>

                    <button
                        class="btn"
                        onclick="openCompareWith(${product.id})"
                    >
                        ⚖ So sánh
                    </button>
                </div>
            </div>
        </div>
    `;

    openModal("quickViewModal");
}

function quickAddToCart(productId){
    addToCart(productId);
    closeModal("quickViewModal");
}

function quickToggleWishlist(productId){
    toggleWishlist(productId);
}

function addQuickViewButtons(){
    $$(".product-card").forEach(card=>{
        if(card.querySelector(".quick-view-btn"))return;

        const id=Number(card.dataset.id);

        if(!id)return;

        const button=document.createElement("button");

        button.className="quick-view-btn";
        button.textContent="👁 Xem nhanh";

        button.addEventListener("click",e=>{
            e.stopPropagation();
            openQuickView(id);
        });

        card.appendChild(button);

        card.addEventListener("dblclick",()=>{
            openQuickView(id);
        });
    });
}

/* ================= COMPARE ================= */

function populateCompareSelects(){
    const select1=$("#compareProduct1");
    const select2=$("#compareProduct2");

    if(!select1||!select2)return;

    const options=products.map(product=>`
        <option value="${product.id}">
            ${product.name}
        </option>
    `).join("");

    select1.innerHTML=options;
    select2.innerHTML=options;

    if(products.length>1){
        select2.selectedIndex=1;
    }
}

function openCompareWith(productId){
    closeModal("quickViewModal");

    populateCompareSelects();

    $("#compareProduct1").value=productId;

    const another=products.find(
        product=>product.id!==Number(productId)
    );

    if(another){
        $("#compareProduct2").value=another.id;
    }

    openModal("compareModal");
}

function renderCompare(){
    const id1=Number($("#compareProduct1").value);
    const id2=Number($("#compareProduct2").value);

    const product1=products.find(item=>item.id===id1);
    const product2=products.find(item=>item.id===id2);

    if(!product1||!product2)return;

    if(product1.id===product2.id){
        showToast(
            "Chọn sản phẩm khác",
            "Vui lòng chọn hai sản phẩm khác nhau",
            "error"
        );
        return;
    }

    const extra1=getProductExtra(product1.id);
    const extra2=getProductExtra(product2.id);

    $("#compareResult").innerHTML=`
        <table class="compare-table">
            <tr>
                <th>Thông tin</th>
                <th>${product1.icon} ${product1.name}</th>
                <th>${product2.icon} ${product2.name}</th>
            </tr>

            <tr>
                <th>Giá</th>
                <td>${formatMoney(product1.price)}</td>
                <td>${formatMoney(product2.price)}</td>
            </tr>

            <tr>
                <th>Danh mục</th>
                <td>${product1.category}</td>
                <td>${product2.category}</td>
            </tr>

            <tr>
                <th>Đánh giá</th>
                <td>⭐ ${extra1.rating}/5</td>
                <td>⭐ ${extra2.rating}/5</td>
            </tr>

            <tr>
                <th>Tính năng</th>
                <td>${extra1.specs[0]}</td>
                <td>${extra2.specs[0]}</td>
            </tr>

            <tr>
                <th>Ưu đãi</th>
                <td>
                    ${product1.oldPrice
                        ?`Giảm ${Math.round((1-product1.price/product1.oldPrice)*100)}%`
                        :"Giá tốt"
                    }
                </td>

                <td>
                    ${product2.oldPrice
                        ?`Giảm ${Math.round((1-product2.price/product2.oldPrice)*100)}%`
                        :"Giá tốt"
                    }
                </td>
            </tr>
        </table>
    `;
}

$("#runCompare")?.addEventListener(
    "click",
    renderCompare
);

/* ================= CLICK PRODUCT ================= */

function enableProductQuickView(){
    $$(".product-card").forEach(card=>{
        const id=Number(card.dataset.id);

        if(!id)return;

        card.addEventListener("click",e=>{
            if(
                e.target.closest("button")||
                e.target.closest("a")
            ){
                return;
            }

            openQuickView(id);
        });
    });
}

/* ================= SCROLL PROGRESS ================= */

function updateScrollProgress(){
    const scrollTop=
        window.pageYOffset||
        document.documentElement.scrollTop;

    const maxScroll=
        document.documentElement.scrollHeight-
        window.innerHeight;

    const progress=maxScroll>0
        ?(scrollTop/maxScroll)*100
        :0;

    const bar=$("#scrollProgressBar");

    if(bar){
        bar.style.width=progress+"%";
    }
}

window.addEventListener(
    "scroll",
    updateScrollProgress,
    {passive:true}
);

updateScrollProgress();

/* ================= ESC CLOSE ================= */

document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
        ["quickViewModal","compareModal"].forEach(id=>{
            const modal=$("#"+id);

            if(
                modal&&
                modal.classList.contains("active")
            ){
                closeModal(id);
            }
        });
    }
});

/* ================= PART 7 INIT ================= */

populateCompareSelects();
addQuickViewButtons();
enableProductQuickView();
renderRecentProducts();

console.log(
    "%cPART 7 PRODUCT EXPERIENCE LOADED ✓",
    "color:#7c5cff;font-size:14px;font-weight:bold"
);

    /* ================= PART 8 - FLASH SALE & LUCKY ================= */

const flashSaleEnd=Date.now()+(6*60*60*1000);

function updateFlashCountdown(){
    const diff=Math.max(0,flashSaleEnd-Date.now());
    const hours=Math.floor(diff/3600000);
    const minutes=Math.floor((diff%3600000)/60000);
    const seconds=Math.floor((diff%60000)/1000);

    const h=$("#flashHours");
    const m=$("#flashMinutes");
    const s=$("#flashSeconds");

    if(h)h.textContent=String(hours).padStart(2,"0");
    if(m)m.textContent=String(minutes).padStart(2,"0");
    if(s)s.textContent=String(seconds).padStart(2,"0");
}

setInterval(updateFlashCountdown,1000);
updateFlashCountdown();

function renderFlashProducts(){
    const container=$("#flashProducts");
    if(!container||!products?.length)return;

    const flashList=products.slice(0,4);

    container.innerHTML=flashList.map((product,index)=>{
        const percent=[78,62,85,48][index]||60;
        const discount=[20,15,25,10][index]||10;

        return `
            <div class="flash-card">
                <span class="flash-badge">⚡ -${discount}%</span>
                <div class="flash-icon">${product.icon}</div>
                <b>${product.name}</b>
                <strong>${formatMoney(product.price)}</strong>
                <div class="flash-progress">
                    <span style="width:${percent}%"></span>
                </div>
                <small class="flash-stock">Đã bán ${percent}% • Sắp hết hàng</small>
                <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="addToCart(${product.id})">
                    🛒 Mua ngay
                </button>
            </div>
        `;
    }).join("");
}

/* ================= LUCKY WHEEL ================= */

const luckyRewards=[
    {name:"Voucher giảm 5%",code:"LUCKY5"},
    {name:"Voucher giảm 10%",code:"LUCKY10"},
    {name:"Voucher giảm 15%",code:"LUCKY15"},
    {name:"Voucher FREESHIP",code:"FREESHIP"},
    {name:"Voucher giảm 20.000₫",code:"LUCKY20K"},
    {name:"Voucher giảm 5%",code:"LUCKY5"}
];

let luckySpinning=false;
let wheelRotation=0;

$("#openLuckyWheel")?.addEventListener("click",()=>{
    openModal("luckyModal");
    
    if(localStorage.getItem("hk_has_spun") === "true"){
        const savedCode = localStorage.getItem("hk_lucky_voucher");
        $("#spinLuckyWheel").textContent = "ĐÓNG VÀ MUA SẮM";
        if(savedCode) {
            const reward = luckyRewards.find(r => r.code === savedCode) || {name: savedCode};
            $("#luckyStatus").innerHTML = `🎉 Bạn đã trúng <b>${reward.name}</b> rồi!`;
        }
    } else {
        $("#spinLuckyWheel").textContent = "🎡 QUAY NGAY";
        $("#luckyStatus").textContent = "Nhấn nút để thử vận may!";
    }
});

$("#spinLuckyWheel")?.addEventListener("click",()=>{
    if(luckySpinning)return;

    if(localStorage.getItem("hk_has_spun") === "true"){
        closeModal("luckyModal");
        return;
    }

    luckySpinning=true;

    const wheel=$("#luckyWheel");
    const button=$("#spinLuckyWheel");
    const status=$("#luckyStatus");

    const rewardIndex=Math.floor(Math.random()*luckyRewards.length);
    const reward=luckyRewards[rewardIndex];

    button.disabled=true;
    button.textContent="ĐANG QUAY...";
    status.textContent="🎡 Đang xác định phần thưởng...";

    wheelRotation+=1800+(360-rewardIndex*60)+30;

    wheel.style.transform=`rotate(${wheelRotation}deg)`;

    setTimeout(()=>{
        luckySpinning=false;
        button.disabled=false;
        
        button.textContent="ĐÓNG VÀ MUA SẮM";
        status.innerHTML=`🎉 Chúc mừng! Bạn nhận được <b>${reward.name}</b>`;

        localStorage.setItem("hk_lucky_voucher", reward.code);
        localStorage.setItem("hk_has_spun", "true");

        createConfetti(80);

        showToast(
            "🎉 Chúc mừng!",
            `Bạn nhận được mã ${reward.code}`
        );
    },5200);
});

/* ================= PROMO POPUP ================= */

$("#copyWelcomeVoucher")?.addEventListener("click",()=>{
    copyVoucher("WELCOME10");
});

$("#claimPromo")?.addEventListener("click",()=>{
    copyVoucher("WELCOME10");
    closeModal("promoModal");

    document.querySelector("#flashSale")?.scrollIntoView({
        behavior:"smooth"
    });
});

setTimeout(()=>{
    if(!sessionStorage.getItem("hk_promo_shown")){
        openModal("promoModal");
        sessionStorage.setItem("hk_promo_shown","true");
    }
},2500);

/* ================= PURCHASE NOTIFICATION ================= */

const fakeBuyers=[
    "Minh Anh","Hoàng Nam","Tuấn Kiệt","Ngọc Linh",
    "Quang Huy","Khánh Vy","Đức Anh","Thu Trang",
    "Bảo Long","Hà My"
];

let purchaseTimer;

function showPurchaseNotification(){
    if(!products?.length)return;

    const name=fakeBuyers[
        Math.floor(Math.random()*fakeBuyers.length)
    ];

    const product=products[
        Math.floor(Math.random()*products.length)
    ];

    $("#purchaseName").textContent=`${name} vừa đặt hàng`;
    $("#purchaseProduct").textContent=`${product.icon} ${product.name}`;

    const popup=$("#purchasePopup");
    popup.classList.add("show");

    clearTimeout(purchaseTimer);

    purchaseTimer=setTimeout(()=>{
        popup.classList.remove("show");
    },5000);
}

$("#closePurchasePopup")?.addEventListener("click",()=>{
    $("#purchasePopup").classList.remove("show");
});

setTimeout(showPurchaseNotification,8000);
setInterval(showPurchaseNotification,28000);

/* ================= LIVE VIEWERS ================= */

function updateViewerCount(){
    const base=100+Math.floor(Math.random()*90);
    const count=$("#viewerCount");

    if(count)count.textContent=base;
}

updateViewerCount();
setInterval(updateViewerCount,7000);

/* ================= CONFETTI ================= */

function createConfetti(amount=60){
    const container=$("#confettiContainer");
    if(!container)return;

    for(let i=0;i<amount;i++){
        const item=document.createElement("span");

        item.className="confetti";
        item.style.left=Math.random()*100+"vw";
        item.style.setProperty(
            "--x",
            `${Math.random()*300-150}px`
        );

        item.style.background=[
            "#7c5cff",
            "#00d4ff",
            "#ff508c",
            "#ffb347",
            "#4cff91"
        ][Math.floor(Math.random()*5)];

        item.style.animationDelay=Math.random()*.5+"s";
        item.style.animationDuration=2+Math.random()*1.5+"s";

        container.appendChild(item);

        setTimeout(()=>item.remove(),4500);
    }
}

/* ================= PART 8 INIT ================= */

renderFlashProducts();

console.log(
    "%cPART 8 FLASH SALE LOADED ✓",
    "color:#ff508c;font-size:14px;font-weight:bold"
);

/* ================= SMART DISCOVERY ================= */

function initSmartDiscovery(){
    const input=$("#smartSearchInput");
    const category=$("#smartCategory");
    const price=$("#smartPrice");
    const suggestions=$("#smartSuggestions");
    const clearBtn=$("#clearSmartSearch");
    const searchBtn=$("#smartSearchBtn");
    const resetBtn=$("#smartReset");

    if(!input)return;

    const smartProducts=Array.isArray(products)?products:[];

    /* Hiển thị số sản phẩm */
    const productCount=$("#smartProductCount");
    const resultCount=$("#smartResultCount");

    if(productCount){
        productCount.textContent=String(smartProducts.length).padStart(2,"0");
    }

    if(resultCount){
        resultCount.textContent=smartProducts.length;
    }

    /* Tạo danh mục tự động */
    if(category&&smartProducts.length){
        const categories=[
            ...new Set(
                smartProducts
                    .map(product=>product.category)
                    .filter(Boolean)
            )
        ];

        category.innerHTML=`
            <option value="all">Tất cả danh mục</option>
            ${categories.map(item=>`
                <option value="${item}">${item}</option>
            `).join("")}
        `;
    }

    function formatSmartMoney(value){
        if(typeof formatMoney==="function"){
            return formatMoney(value);
        }
        return Number(value||0).toLocaleString("vi-VN")+"₫";
    }

    function getFilteredProducts(){
        const keyword=input.value.trim().toLowerCase();
        const selectedCategory=category?.value||"all";
        const selectedPrice=price?.value||"all";

        return smartProducts.filter(product=>{
            const name=String(product.name||"").toLowerCase();
            const productCategory=String(product.category||"");
            const productPrice=Number(product.price||0);

            const matchKeyword=
                !keyword||
                name.includes(keyword)||
                productCategory.toLowerCase().includes(keyword);

            const matchCategory=
                selectedCategory==="all"||
                productCategory===selectedCategory;

            let matchPrice=true;

            if(selectedPrice==="under500"){
                matchPrice=productPrice<500000;
            }
            if(selectedPrice==="500to1000"){
                matchPrice=productPrice>=500000&&productPrice<=1000000;
            }
            if(selectedPrice==="over1000"){
                matchPrice=productPrice>1000000;
            }

            return matchKeyword&&matchCategory&&matchPrice;
        });
    }

    function updateSmartResult(){
        const result=getFilteredProducts();

        if(resultCount){
            resultCount.textContent=result.length;
        }

        const resultText=$("#smartResultText");
        const resultSubtext=$("#smartResultSubtext");

        if(resultText){
            resultText.textContent=result.length
                ? `Tìm thấy ${result.length} sản phẩm phù hợp`
                : "Không tìm thấy sản phẩm phù hợp";
        }

        if(resultSubtext){
            resultSubtext.textContent=result.length
                ? "Bạn có thể xem ngay các sản phẩm bên dưới"
                : "Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm";
        }

        if(clearBtn){
            clearBtn.style.display = input.value.trim().length > 0 ? "block" : "none";
        }

        // HIDE/SHOW ACTUAL PRODUCT CARDS IN GRID
        const cards = $$("#productGrid .product-card");
        cards.forEach(card => {
            const id = Number(card.dataset.id);
            const isVisible = result.some(p => p.id === id);
            card.style.display = isVisible ? "" : "none";
        });

        return result;
    }

    function showSuggestions(){
        const keyword=input.value.trim().toLowerCase();

        if(!keyword){
            suggestions?.classList.remove("show");
            return;
        }

        const result=smartProducts
            .filter(product=>{
                const name=String(product.name||"").toLowerCase();
                const categoryName=String(product.category||"").toLowerCase();
                return name.includes(keyword)||categoryName.includes(keyword);
            })
            .slice(0,5);

        if(!result.length){
            if(suggestions) {
                suggestions.innerHTML=`
                    <div class="smart-suggestion">
                        <div class="smart-suggestion-icon">⌕</div>
                        <div>
                            <b>Không có gợi ý phù hợp</b>
                            <span>Hãy thử một từ khóa khác</span>
                        </div>
                    </div>
                `;
                suggestions.classList.add("show");
            }
            return;
        }

        if(suggestions) {
            suggestions.innerHTML=result.map(product=>`
                <div class="smart-suggestion" data-smart-product="${product.id}">
                    <div class="smart-suggestion-icon">
                        ${product.icon||"🛍️"}
                    </div>
                    <div>
                        <b>${product.name}</b>
                        <span>
                            ${product.category||"Sản phẩm"} •
                            ${formatSmartMoney(product.price)}
                        </span>
                    </div>
                </div>
            `).join("");

            suggestions.classList.add("show");

            suggestions.querySelectorAll(".smart-suggestion[data-smart-product]")
                .forEach(item=>{
                    item.addEventListener("click",()=>{
                        const id=item.dataset.smartProduct;
                        const product=smartProducts.find(
                            product=>String(product.id)===String(id)
                        );

                        if(product){
                            input.value=product.name;
                            suggestions.classList.remove("show");
                            updateSmartResult();
                            scrollToGrid();
                        }
                    });
                });
        }
    }

    function scrollToGrid() {
        const productArea=$("#productGrid");
        if(productArea) {
            const headerOffset = 100;
            const elementPosition = productArea.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    }

    function performSmartSearch(){
        const result=updateSmartResult();
        suggestions?.classList.remove("show");
        scrollToGrid();

        if(result.length){
            showToast?.(
                "🔎 Tìm kiếm thành công",
                `Đã tìm thấy ${result.length} sản phẩm phù hợp`
            );
        }else{
            showToast?.(
                "Không tìm thấy sản phẩm",
                "Hãy thử thay đổi từ khóa tìm kiếm",
                "error"
            );
        }
    }

    input.addEventListener("input",()=>{
        updateSmartResult();
        showSuggestions();
    });

    input.addEventListener("keydown",event=>{
        if(event.key==="Enter"){
            performSmartSearch();
        }
    });

    category?.addEventListener("change",updateSmartResult);
    price?.addEventListener("change",updateSmartResult);

    searchBtn?.addEventListener("click",performSmartSearch);

    clearBtn?.addEventListener("click",()=>{
        input.value="";
        suggestions?.classList.remove("show");
        updateSmartResult();
        input.focus();
    });

    resetBtn?.addEventListener("click",()=>{
        input.value="";
        if(category)category.value="all";
        if(price)price.value="all";

        suggestions?.classList.remove("show");
        updateSmartResult();

        showToast?.(
            "↻ Đã đặt lại",
            "Tất cả bộ lọc đã được khôi phục"
        );
    });

    document.querySelectorAll("[data-search]").forEach(button=>{
        button.addEventListener("click",()=>{
            input.value=button.dataset.search||"";
            updateSmartResult();
            showSuggestions();
            input.focus();
        });
    });

    $("#scrollToProductResults")?.addEventListener("click", scrollToGrid);

    document.addEventListener("click",event=>{
        if(!event.target.closest(".smart-input-wrap")){
            suggestions?.classList.remove("show");
        }
    });

    updateSmartResult();
}

// Call safely
document.addEventListener("DOMContentLoaded",()=>{
    setTimeout(initSmartDiscovery,100);
});
