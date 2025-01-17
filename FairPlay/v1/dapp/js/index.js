const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
var baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/v1/dapp/';


$(document).ready(function () {
    setupCaseWeb3();
    initLanguage();
    $(".search-box").val("")
    initCSS();
    initInfo();
});

var setupCaseWeb3 = () => {
    try{
        web3.cmt.getAccounts(function (e, address) {
            if (e) {
                tip.error(lgb["error"] || "There is an error");
            } else {
                var userAddress = address.toString();
                var shortAddr = userAddress.substr(0,5) + "***" + userAddress.substr(-3)
                $("#self_addr").html(shortAddr);
            }
        })
    }catch(e){
        console.log("no web3")
        $(".tab-btns").hide()
        $(".sidebar-header").css("margin-top","50px")
        $(".sidebar-header>p").css("position","relative")
        $("#sidebar ul").hide()
        $("#create-btn").append("<div><small>" + (lgb['go_open'] || "open in cmt wallet") + "</small></div>")

    }
}

var initLanguage = function () {
    if (lgb == '' || lgb == null) {
        return;
    }
     $("[data-translate]").each(function(){
        var key = $(this).data('translate');
        if(lgb[key]){
            if(this.tagName.toLowerCase() == "input" || this.tagName.toLowerCase() == "textarea"){
                $(this).attr("placeholder", lgb[key])
            }else{
                $(this).html(lgb[key]);
            }
        }
    });
}

initCSS = () => {
    $(".create-btn").attr("href", baseUrl + "create.html")
    $(".result-won").attr("href", baseUrl + "search-results.html?method=won")
    $(".result-participated").attr("href", baseUrl + "search-results.html?method=participated")
    $(".result-created").attr("href", baseUrl + "search-results.html?method=created")
    $(".result-unfiltered").attr("href", baseUrl + "search-results.html?method=unfiltered")
    $("#search-panel").attr("action", baseUrl + "search-results.html")

    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        // hide sidebar
        $('#sidebar').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        // open sidebar
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
}

var initInfo =  async () => {
    $(".more-plays").text(lgb["loading"] || "loading...")

    
    var n_current_giveaway = 0 
    if(localStorage.getItem('latestGiveaways')){
        arrLG = JSON.parse(localStorage.getItem('latestGiveaways'))
        n_current_giveaway = arrLG.length
        await renderGiveaways(arrLG)
    }

    latestGiveaways = await getItemsViaFlask({_compare: compare, _cmpParams: ["_source","blockNumber"], _renderNow: false});
    console.log(latestGiveaways, latestGiveaways.length, n_current_giveaway)
    

    if(n_current_giveaway == 0){
        n_current_giveaway = latestGiveaways.length
        await renderGiveaways(latestGiveaways)
    }
    if(n_current_giveaway >= 10)
    {
        $(".more-plays").text(lgb["more"] || "More")
    }else{
        $(".more-plays").text(lgb["nomore"] || "No more items.")
    }
    console.log(latestGiveaways.length, n_current_giveaway)
    // if(latestGiveaways.length > n_current_giveaway){
         jsonLG = JSON.stringify(latestGiveaways)
         localStorage.setItem('latestGiveaways', jsonLG);
         n_current_giveaway = latestGiveaways.length;
         //reapply new items
         await renderGiveaways(latestGiveaways)
    // }

    $(".more-plays").click(()=>{
      var moreitems = 0   
      var n_itmes = $(".card").length
      $(".card").each((i, obj)=>{
        if(!$(obj).hasClass("card-template") && $(obj).hasClass("d-none") && moreitems < 10){
            $(obj).removeClass("d-none")
            moreitems ++
            if(i == n_itmes - 1){
              $(".more-plays").html(lgb["nomore"]||"No more itmes.")
            }
        }
      });
    });
}
