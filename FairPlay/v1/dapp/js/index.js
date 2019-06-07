const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();

$(document).ready(function () {
    webBrowser.openBrowser();
    initLanguage();

    initCSS();
    initInfo();
});

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

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb["error"] || "There is an error");
        } else {
            var userAddress = address.toString();
            var shortAddr = userAddress.substr(0,5) + "***" + userAddress.substr(-3)
            $("#self_addr").html(shortAddr);
        }
    })

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
