import React from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import List from './List'
import Menu from './Menu'
import * as actions from './actions'

class Map extends React.Component {
    constructor(props){
        super(props)
        this.map = null
        this.markers = []
    }
    componentDidMount(){
        this.addMap()
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.update){
            this.clearMap()
            this.map.setCenter(nextProps.center)
            nextProps.items.forEach(item => { this.addMarker(item) })
        }
    }
    addMap(){
        const { center } = this.props
        const $map_panel = $(".map_panel")
        const h = $(window).height() -
            $('.header, .swipe_panel_top, .search_top')
                .map( (i,el)  => { return $(el).outerHeight() })
                .get()
                .reduce((memo, item) => { return memo += item },0)
        $map_panel
            .height(h)
            .css({'top': -2 * h})
            .show()

        this.map = new google.maps.Map($("#map_canvas").height(h).get(0), {
            zoom: 12,
            center : new google.maps.LatLng(center.lat, center.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        setTimeout(() => {
            $map_panel
                .hide()
                .css({'top': 0})
            },200)
    }
    addMarker(item){
        const loc = (item.Adress && item.Adress.marker) || item.location;
        if(loc){
            let params = {
                position: loc,
                map: this.map,
                title: item.name
            };
//            params.icon = img || "/img/svg/map_googl.svg";
            let address = ""
            try{
                address = item.Adress.street + " " + item.Adress.house
            }catch(e){}
            const infowindow = new google.maps.InfoWindow({
                content: '<div onclick="Controller.go(\'' + item._id +'\')">' + item.name +'<br>' + address + '</div>'
            });
            let m = new google.maps.Marker(params),
                map = this.map
            m.addListener('click', e => {
                for(let id in this.markers)
                    this.markers[id].infowindow.close();
                infowindow.open(map, m);
            });
            m.infowindow = infowindow;
            this.markers[item._id] = m
        }
    }
    clearMap(){
        for(let id in this.markers)
            this.markers[id].setMap(null);
        this.markers = {}
    }
    shouldComponentUpdate ( nextProps, nextState ) {
        return !this.map
    }
    render(){
        return (
        <div className="map_panel">
            <div id="map_canvas"></div>
        </div>
        )
    }
}

class Main extends React.Component {
    constructor(props){
        super(props)
        this.toggleMenu = this.toggleMenu.bind(this)
        this.cityChanged = this.cityChanged.bind(this)
        this.slideout = null
    }
    componentDidMount(){
        const content = $('.content'),
            header = $('.header'),
            header_height = header.height() + parseInt(header.css('paddingTop')) + parseInt(header.css('paddingBottom'));
        content.css({'marginTop': header_height})

        this.slideout = new Slideout({
            'panel': document.getElementById('main_container'),
            'menu': document.getElementById('main_menu'),
            'padding': $(window).width(),
            'tolerance': 50,
            'side': 'right'
        })
        this.slideout.disableTouch();

        $('.city_selector').customSelect();
        this.props.actions.getCuisines(this.props.city)
    }
    toggleMenu(){
        this.slideout.toggle()
    }
    toggleMap(e){
        $('.map_panel').toggle();
        $(e.target).toggleClass('close');
    }
    cityChanged(e){
        this.props.actions.setCity($(e.target).val())
    }
    render() {
        const prime101 = this.props.params.category == 'prime101' ? "swipe_panel_selections_item prime_101 active" : "swipe_panel_selections_item prime_101";
        return (
        <div>
            <Menu toggleMenu={this.toggleMenu}/>
            <div id="main_container" className="mainContainer">
                <div className="header">
                    <table>
                    <tbody>
                        <tr>
                            <td className="headerLeft">
                                <a href="#" target="_self" className="header_link">Отмена</a>
                            </td>
                            <td className="headerMiddle">
                                <div className="city_selector_container">
                                    <select className="city_selector" onChange={this.cityChanged} defaultValue={this.props.city}>
                                        {window._INITIA_STATE_.cities.map((c, i)=>{
                                            return ( <option key={i} value={c.city_en}>{c.City}</option>)
                                        })}
                                    </select>
                                    <div className="clear"></div>
                                </div>
                            </td>
                            <td className="headerRight">
                                <a href="javascript:;" target="_self" onClick={this.toggleMenu} className="menu_link"></a>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <div className="content">
                    <div className="overlay"></div>

                    <div className="search_top">
                        <form action="#" className="search_form">
                            <table>
                                <tbody>
                                <tr>
                                    <td className="search_top_left"><input type="text" name="search" placeholder="Поиск ресторанов" /></td>
                                        <td className="search_top_right">
                                            <a href="javascript:;" target="_self" className="map_link" onClick={this.toggleMap} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>

                    <div className="swipe_panel">
                        <div className="swipe_panel_top">
                            <ul className="swipe_panel_selections">
                                <li><Link style={{textDecoration:'none'}} to="prime101"><div className={prime101}>&nbsp;</div></Link></li>
                                {this.props.filters.map((f,i)=>{
                                    const clazz = this.props.params.category == f.link ? "swipe_panel_selections_item active" : "swipe_panel_selections_item";
                                    return <li key={i}><Link style={{textDecoration:'none'}} to={f.link}><div className={clazz}>{f.title}</div></Link></li>
                                })}
                            </ul>
                        </div>

                        <div className="swipe_panel_botttom">
                            <Map update={this.props.update} items={this.props.listItems} center={this.props.center} />
                            <List {...this.props} />

                        </div>
                    </div>

                    <div className="clear"></div>
                </div>

            </div>
        </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        filters : state.filters,
        listItems : state.listItems,
        center : state.center,
        city : state.city,
        update : state.update,
        cuisines : state.cuisines
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main)