;(function(exports){
    "use strict"
 
    var $ = require('jQuery'), 
    Masonry = require('masonry-layout'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    MyViewConstructor = require('./TemplateView.js'),
    Velocity = require("../node_modules/velocity-animate/velocity.min.js")

    Backbone.$ = $;


    Backbone.AppRouter = Backbone.Router.extend({
        initialize: function(){
            console.log('router initialized');
            this.homeView = new Backbone.HomeView();
            this.odysseyView = new Backbone.OdysseyView();
            this.menusView = new Backbone.MenusView();
            this.detailsView = new Backbone.DetailsView();
            this.layoutsView = new Backbone.LayoutsView();
            this.rolldownView = new Backbone.RollDownView();
            this.splitView = new Backbone.SplitView();
            this.tripleView = new Backbone.TripleView();
            this.formTableView = new Backbone.FormTableView();

            Backbone.history.start();
        },

        routes: {
            "form-table": "goToFormsTables",
            "layouts/triple-view": "goToTripleView",
            "layouts/split-view": "goToSplitView",
            "layouts/rolldown": "goToRolldown",
            "layouts": "goToLayouts",
            "details": "goToDetails",
            "menus-and-modals": "goMenusAndModals",
            "odyssey":"goNavExamples",
            "*default": "goHome",
        },

        goHome: function(){
            this.homeView.render();
             var el = document.querySelectorAll('.flex-box');
            
        },

        goNavExamples: function(){
            this.odysseyView.render();
            window.scrollTo(0,0);

        },

        goMenusAndModals: function(){
            var self = this
            this.menusView.render();
            window.scrollTo(0,0);

        },

        goToDetails: function(){
            var self = this;
            if(window){window.scrollTo(0,0);}

            this.detailsView.render();
        },

        goToLayouts: function(){
            this.layoutsView.render();
        },

        goToRolldown: function(){
            this.rolldownView.render();
        },

        goToSplitView: function(){
            this.splitView.render();
        },

        goToTripleView: function(){
            this.tripleView.render();
            this.tripleView.loadEvents();
        },

        goToFormsTables: function(){
            this.formTableView.render();
        },




    });

    Backbone.HomeView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: 'homepage'
    });

    Backbone.OdysseyView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: 'odyssey',

        events: {
            "click button.showMenu": "popOutNav",
            "click button.modal": "toggleModal",
            "click button.exit-modal": "toggleModal"
        },

        _popOutNav: function(evt){
            evt.preventDefault();
            var evtTarget = $(evt.target);
            $('nav.cbp-spmenu-top').toggleClass('pop-out')
            evtTarget.toggleClass('popped')
            evtTarget.hasClass('popped') ? evtTarget.text('-') : evtTarget.text('+')
        },

        _toggleModal: function(evt){
            evt.preventDefault();
            $('.md-effect').toggleClass('md-show');
            console.log('toggled')
        },
    });

    Backbone.MenusView = MyViewConstructor.TemplateView.extend({
        el: ".wrapper",
        view: 'menus',

        events: {
            'click .menu-btn' : 'showMenu',
            'click .menu-btn-scroll': 'showScroll',
            'click .pull-icons': 'showIcons',
            'click .dd-btn': 'showDropList',
            'click .mega-btn': 'showMegaMenu'

        },

        showMenu: function(evt){
            var menuTypeJQ = $(evt.target).attr('data-menuType')
            
            var $sideMenu = $('.'+ menuTypeJQ);
            var $divOverlay = $('.nav-screen-overlay');

            $('.'+ menuTypeJQ).addClass('extended');
            $divOverlay.addClass('show');

            $divOverlay.on('click', function(){
                $(this).removeClass('show');
                $sideMenu.removeClass('extended')
            });

            if(menuTypeJQ==='push-menu'){
                var $body = $(document.body)
                $body.addClass('push-menu')
                $divOverlay.on('click', function(){
                    $body.removeClass('push-menu')
                })
            }

        },

        showScroll: function(evt){
            var $scrollMenu = $('.scroll-menu'),
                $aside = $('aside.dummy-content')
            
            $scrollMenu.addClass('extended');
            $('aside').show();

            $scrollMenu.find('li a').on('click',function(evt){
                evt.preventDefault();
                var anchorName = ($(evt.target).attr('href')).substr(1)
                var domElPosition = $('a[name="'+anchorName+'"]').position();
                $('html, body').animate({
                    scrollTop: domElPosition.top
                })
            })

            $('.close-scroll').on('click',function(){
                $scrollMenu.removeClass('extended')
                if($aside){$aside.hide()}
            })
        },

        showIcons: function(evt){
            var $iconPanel = $('.icon-panel'),
            $pullIcons = $('.pull-icons');

            console.log('hey')
            $iconPanel.toggleClass('extended');
        },

        showDropList: function(evt){
            var $dropDownList = $('.dd-list');
            $dropDownList.toggle();
        },

        showMegaMenu: function(evt){
            var $megaMenu = $('.mega-menu')
            var hidden;
            $megaMenu.css('display') === 'none'? hidden=true : hidden=false;
            $megaMenu.toggle()
            
            hidden === true ? $('html, body').scrollTop($(document).height()): hidden;
        } 

    })

    Backbone.DetailsView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: 'details',

        events: {
            'click .modal-btn': 'overlayHandler',
            'click .tab': 'tabHandler',
            'click .slide-btn': 'slideHandler',
            'click .toggle-content': 'accordionHandler',
        },

        overlayHandler: function(evt){
            console.log('overlay')

            var insertOverlay = function(e){
                var effect = $(e.target).attr('data-effect');
                $('.mdl-context'+'.'+effect).addClass('mdl-show')
            }
            
            var removeOverlay = function(){
                $('.mdl-context').removeClass('mdl-show');
            }
            insertOverlay(evt);
            $('.mdl-overlay').on('click', removeOverlay)
            $('.exit-modal').on('click', removeOverlay)
        },

        tabHandler: function(evt){
            var $currentTab = $('.selected-tab'),
                $selectedTarget = $(evt.target),
                selectedIndex = $selectedTarget.index()+1;


            $currentTab.removeClass('selected-tab');
            $('.selected-article').removeClass('selected-article')

            console.log(selectedIndex+1)
            $selectedTarget.addClass('selected-tab');
            $('.tabs-content > article:nth-of-type('+selectedIndex+')').addClass('selected-article')
        },

        slideHandler: function(evt){
            var $selectedSlide = $(evt.target).closest('li'),
                eventIndex = $selectedSlide.index()+1


            console.log($selectedSlide)
            $('.current-slide').removeClass('current-slide')
            $('.current-content').removeClass('current-content')
            $selectedSlide.addClass('current-slide')
            $('ul > li:nth-of-type('+eventIndex+')').addClass('current-content')
            $('.top-slider-container').scrollTop(0)

            $('li.content-slide').each(function(index,value){
                if(index+1 > eventIndex){$(this).addClass('after')}
                    else{$(this).removeClass('after')}
            })
        },

        accordionHandler: function(evt){
            var $collapsibleContent = $('.collapsible-content')

            $collapsibleContent.slideToggle().toggleClass('extended')

            if( $collapsibleContent.hasClass('extended')){
                $('.toggle-content span').text('-');
                console.log('has extended')
            } else {
                $('.toggle-content span').text('+');
            }
        },
    })

    Backbone.LayoutsView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: 'layouts',

        events: {
            'click .parallax-btn': 'showParallax'
        },

        showParallax: function(){
            console.log('hi');
            $('.parallax').show();
        }
    })

    Backbone.RollDownView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: '_layouts_rolldown',

        events: {
            'click a.jump-to':'scrollToPlace'
        },

        scrollToPlace: function(evt){
            console.log('working or routing?')
            evt.preventDefault();
            var anchorName = ($(evt.target).attr('href')).substr(1)
            var domElPosition = $('a[name="'+anchorName+'"]').position();
            
            var navBarHeight = $('nav').height()
          
            $('html, body').animate({
                scrollTop: domElPosition.top - navBarHeight
            },1000)
        }

    })

    Backbone.SplitView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: '_layouts_split',

        events: {
            "click .open-pane":"showFlap"
        },

        showFlap: function(evt){
            var $centralFlap = $('.central-flap'),
                $sideFlap_Left = $('.side-flap.left'),
                $sideFlap_Right = $('.side-flap.right'),
                 leftPaneClick = $(evt.target).closest('.main-pane').hasClass('left')
            
            if(leftPaneClick){
                $centralFlap.addClass('__shift-center-right')
                $sideFlap_Left.addClass('__shift-flap-right')
            } else {
                $centralFlap.addClass('__shift-center-left')
                $sideFlap_Right.addClass('__shift-flap-left')
            }
        }
    })

    Backbone.TripleView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: '_layouts_triple',

        loadEvents:function(){
            (function(){
                console.log('events loaded!')

            })()

        }



    })

    Backbone.FormTableView = MyViewConstructor.TemplateView.extend({
        el: '.wrapper',
        view: 'form-table',

        events: {
            'click .form-btn': 'toggleForm',
            'click .table-btn': 'toggleTable'
        },

        toggleForm: function(evt){
            $('.form').toggleClass('show')
            $('.table').removeClass('show')
            console.log('forrmzo')
        },

        toggleTable: function(evt){
            $('.table').toggleClass('show')
            $('.form').removeClass('show')
            console.log('table')
        }
    })

    exports.AppRouter = Backbone.AppRouter

})(typeof module === "object" ? module.exports : window)
