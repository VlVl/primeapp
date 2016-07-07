import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './actions'

import ListItem from './ListItem'

class UberPopap extends Component {
    constructor(props){
        super(props)
        this.state = {arr : this.props.arr, loc : this.props.loc}
    }
    closePopap(){
        $('.uber_popup').hide()
        $('.overlay').hide()
    }
    render(){
        const {arr, loc} = this.state
        return(
        <div className="uber_popup animated">
            <div className="uber_popup_top">
                {arr.map((item, i)=>{
                    const re = new RegExp(item.currency_code), price = (item.estimate || "").replace(re, ""),
                    link = ["uber://?client_id=lM5cZ5SLvDrow7PfqTvC3FuXBFgpsp9a&action=setPickup&pickup=my_location&dropoff[latitude]=",
                        loc.lat,"&dropoff[longitude]=", loc.lng,"&product_id=",item.product_id,"&pickup[formatted_address]=",encodeURI($(".card_link.geo").text()),
                        "&dropoff[nickname]=",encodeURI($(".event_collection_item_name").text())].join("");

                    return (
                    <a key={i} href={link} className="uber_popup_link" target="_blank">
                        <table className="uber_popup_top_table">
                            <tbody>
                            <tr>
                                <td className="uber_popup_top_table_left">
                                    <span className="uber_name">{item.display_name}</span>
                                    &nbsp; &nbsp;
                                    <span className="uber_price">{price}</span>
                                </td>
                                <td className="uber_popup_top_table_right">
                                    <span className="uber_timetoride">{'Время в пути ' + Math.round(item.duration/60) + ' мин.'}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </a>
                )})}
                <div className="clear"></div>
            </div>
            <div className="uber_popup_cancel" onClick={this.closePopap}>Отмена</div>
        </div>
        )
    }
}
class Bron extends Component {
    componentDidMount(){
        $('.rest_filter_selector').customSelect()
    }
    render(){
    return (

<div className="card_section">
    <div className="rest_filter_top">
        <div className="rest_filter_params">
            <table className="rest_filter_params_table">
                <tbody>
                <tr>
                    <td className="rest_filter_params_table_left">
                        <select className="rest_filter_selector">
                            <option>1 человек</option>
                            <option>2 человека</option>
                        </select>
                    </td>
                    <td className="rest_filter_params_table_middle">
                        <select className="rest_filter_selector">
                            <option>Сегодня</option>
                            <option>20 мая</option>
                            <option>21 мая</option>
                            <option>22 мая</option>
                            <option>23 мая</option>
                        </select>
                    </td>
                    <td className="rest_filter_params_table_right">
                        <select className="rest_filter_selector">
                            <option>18:00</option>
                            <option>19:00</option>
                            <option>20:00</option>
                            <option>21:00</option>
                            <option>22:00</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div className="rest_filter_bottom">
        <div className="rest_options">
            <input type="text" className="rest_wishes" placeholder="Введите дополнительные пожелания" />
        </div>
    </div>
</div>)
    }
}
class Map extends Component {
    constructor(props){
        super(props)
        this.map = null
        this.marker = null
    }
    componentDidMount(){
        this.addMap()
    }
    componentDidUpdate(nextProps){
        if(this.props.update){
            this.clearMap()
            const { item } = this.props
            const loc = (item.Adress && item.Adress.marker) || item.location;
            this.map.setCenter(loc)
            this.addMarker(loc, item.name)
        }
    }
    clearMap(){
        this.marker = null
    }
    addMap(){
        const $map_panel = $(".card_map")
        const item  = this.props.item
        const loc = (item.Adress && item.Adress.marker) || item.location;
        if(loc){
            this.map = new google.maps.Map($("#card_map_canvas").height(200).get(0), {
                zoom: 14,
                center : new google.maps.LatLng(loc.lat, loc.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            this.addMarker(loc, item.name)
        }
    }
    addMarker(loc, name){
        this.marker = new google.maps.Marker({
            position: loc,
            map: this.map,
            title: name
        })
    }
    shouldComponentUpdate ( nextProps, nextState ) {
        return !this.map
    }
    render(){
        return (
            <div className="card_map">
                <div id="card_map_canvas"></div>
            </div>
        )
    }
}
class Item extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: false,
            uber_data: false
        }
    }
    onClHdl(e){
        $('.overlay').show();
        $('.uber_popup').show();
    }
    componentDidMount(){
        const content = $('.content'),
            header = $('.header'),
            header_height = header.height() + parseInt(header.css('paddingTop')) + parseInt(header.css('paddingBottom'));
        content.css({'marginTop': header_height})

        const url = [this.props.city,"item",this.props.params.category,this.props.params.item || this.props.params.subcategory]
        this.props.actions.getItem('c?pos={}&filter={}&url=' + url.join('/'));
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.params.item != this.props.params.item){
            const url = [nextProps.city,"item",nextProps.params.category,nextProps.params.item || nextProps.params.subcategory]
            this.props.actions.getItem(url.join("/"));
        }else{
            const pos = JSON.stringify({lat:55.748747599999994,lng:37.5629053}), loc = JSON.stringify(nextProps.item.location)
            $.get("/request/c?url=uber&start_pos=" + pos +'&end_pos=' + loc,resp => {
                 this.setState({text : resp.str, uber_data : resp.data});
            })
        }
    }
    componentDidUpdate(){
        $(".card_rating").raty({
            numberMax : 5,
            starOff : '/img/svg/card_star_empty_gray.svg',
            starOn : '/img/svg/card_star_full.svg',
            score: function() {
                return $(this).attr('data-score');
            }
        })
        $(".card_rating_red").raty({
            numberMax : 5,
            starOff : '/img/svg/card_star_empty_gray.svg',
            starOn : '/img/svg/card_star_full_red.svg',
            score: function() {
                return $(this).attr('data-score');
            }
        })
        $('.card_info_collapse').readmore({
            speed: 800,
            collapsedHeight: 106,
            moreLink: '<a href="#" class="card_info_collapse_btn down"></a>',
            lessLink: '<a href="#" class="card_info_collapse_btn up"></a>'
        })
    }
    goBack(){
        this.context.router.goBack()
    }
    address($arr){
        let $res = [];
        if($arr['place']) $res.push($arr['place']);
        if($arr['street']) $res.push($arr['street']);
        if($arr['house']) $res.push($arr['house']);
        return $res.join(", ");
    }
    site($site,$href){
        if(!$site) return "";
        if($href){
            return $site.indexOf('http')==-1 ? 'http://' + $site : $site;
        }else{
            return $site.indexOf('http')== -1 ? $site : $site.replace(/http(s?):\/\//i,'');
        }
    }
    formatWH(s,wh){
        if(s) return s.split(';');
        wh = wh ? wh.working_hours : false;
        if(!wh) return [];
        else
            var tmp_arr = [], days = {1: "ПН",2: "ВТ",3: "СР",4: "ЧТ",5: "ПТ",6:"СБ",7:"ВС"};
        for(var o in wh){
            tmp_arr.push({
                name : days[wh[o].day],
                hours : wh[o].start_time + ' - ' + (wh[o].end_time ? wh[o].end_time :
                    (wh[o].till_last_client ? "до последнего клиента" :""))})
        }
        var res = "";
        var space = false;
        for (var i = 0; i < tmp_arr.length; i++) {
            if(tmp_arr[i-1]){
                if(tmp_arr[i-1].hours == tmp_arr[i].hours){
                    res += !space ? " - " : "";// + tmp_arr[i].name;
                    space = true
                }else{
                    res += tmp_arr[i-1].name +' '+tmp_arr[i-1].hours + ';';
                    if((tmp_arr[i+1] && tmp_arr[i+1].hours == tmp_arr[i].hours) || !tmp_arr[i+1])
                        res += tmp_arr[i].name;
                    space = false;
                }
            }else{
                res += tmp_arr[i].name;
            }
            if(i == tmp_arr.length-1)
                res += (space ? tmp_arr[i].name : "") +' '+tmp_arr[i].hours;
        }
        return res.split(";");
    }
    privileges(item){
        let parr =[], pp = item.pprivileges || {}
        if(item.privileges)
            parr = item.privileges.split("\n")
        return(
            <div className="card_info_line privilegies">
                {parr.map((p,i)=>{ return (<span style={{color:'#b59c71'}} key={i}>{p}<br /></span>) })}
                {Object.keys(pp).map((key, i) => {
                    return (
                    <div key={i}>
                        <span style={{color:'#b59c71'}}>{key}<br /></span>
                        {pp[key].map((p,j)=>{ return <span key={j}>{p}<br /></span> })}
                    </div>)
                })}
            </div>)
    }
    render() {
        const {item, error} = this.props
        const sub = item && item.subcategory ? (item.subcategory[0] ? item.subcategory[0] : item.subcategory ) : {}
        return (
        <div id="main_container" className="mainContainer">
            <div className="header">
                <table>
                <tbody>
                    <tr>
                        <td className="headerLeft">
                            <Link to="javascript:;" onClick={this.goBack.bind(this)} target="_self" className="back_to_link" />
                        </td>
                        <td className="headerMiddle" ></td>
                        <td className="headerRight"></td>
                    </tr>
                </tbody>
                </table>
            </div>

            <div className="content">
                <div className="overlay"></div>
                {item && !error ? (
                <div className="card">
                    <div className="card_top">
                        <ListItem item={item}/>
                    </div>
                <Bron />

                <div className="card_section">
                    <div className="card_text">
                        <div className="card_info_collapse">
                            {item ? <p dangerouslySetInnerHTML={{__html: item.Description}} /> : <p />}
                        </div>
                    </div>
                </div>

                <div className="card_section">
                    <a href="#" className="order_button popup_btn">Забронировать</a>
                </div>

                <div className="card_section">
                    <Map item={item} />
                </div>

                <div className="card_section">
                    <div className="card_info">
                        <div className="card_info_collapse">

                            <div className="card_line">
                                <a href="#" className="card_link geo">{this.address(item.Adress)}</a>
                            </div>

                            <div className="card_info_line uber"><span onClick={this.onClHdl} className="uber_trigger">Доехать на UBER</span>
                                {this.state.text || (<img src="/img/loading2.gif" />)}
                            </div>

                            {this.state.uber_data ? <UberPopap loc={item.location} arr={this.state.uber_data.prices}/> : null}

                            {item.tel ? <div className="card_line"><a href={'tel:'+ item.tel} className="card_link phone">{item.tel}</a></div> : null}
                            {item.SIte ? <div className="card_line"><a href={this.site(item.SIte, true)} className="card_link site">Веб-сайт</a></div> : null}

                            <div className="card_info_line clock">
                                <span>{this.formatWH(null,item.partner)}</span>
                            </div>

                            <div className="card_info_line kitchen">
                                <span>{(item.kitchen || []).map(k => { return k.name}).join()}</span>
                            </div>
                            <div className="card_info_line price">
                                <span>Средний чек от 3500 руб.</span>
                            </div>
                            <div className="card_info_line foodtime">
                                <span>{sub.name}</span>
                            </div>
                            {this.privileges(item)}
                        </div>
                    </div>
                </div>

                <div className="card_section_colored">
                    <table className="card_raiting_table">
                    <tbody>
                        <tr>
                            <td className="card_raiting_table_left">Ваша оценка</td>
                            <td className="card_raiting_table_right"><div className="card_rating" data-user-score="3"></div></td>
                        </tr>
                        <tr>
                            <td className="card_raiting_table_left">Рейтинг PRIME</td>
                            <td className="card_raiting_table_right"><div className="card_rating_red" data-score={item.rating}></div></td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <div className="card_section_empty">
                    <div className="card_recommendation">
                        <table className="card_recommendation_table">
                        <tbody>
                            <tr>
                                <td className="card_recommendation_table_left">
                                    <div className="card_recommendation_title">Выбор членов Клуба</div>
                                </td>
                                <td className="card_recommendation_table_right">
                                    {(item.recs || []).map((r,i)=>{
                                        let src = r.src || (r.files && r.files.length ? r.files[0].src : '')
                                        if(!src)
                                            src = r.name && r.name.files && r.name.files.length ? r.name.files[0].src : '';
                                        var name = (r.name && r.name.name ? r.name.name :  r.name);

                                        return (
                                        <div key={i} className="card_recommendation_image">
                                            <img src={src} alt={name} />
                                        </div>)}
                                    )}
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>

                <div className="clear"></div>
            </div>
                ) : error }
            <div className="clear"></div>
        </div>
    </div>
        )}
}
Item.contextTypes = {
    router: PropTypes.object.isRequired
}
function mapStateToProps (state) {
    return {
        item : state.categoryItem,
        city : state.city,
        error : state.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Item)
