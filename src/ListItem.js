import React, { Component } from 'react'
import {Link} from 'react-router'

export default class ListItem extends Component {
    constructor(props){
        super(props)
        this.likeItem = this.likeItem.bind(this)
        this.state = {like : ""}
        this.icons = {
            "563373b2e86d1a18d345e5fa" : "badge_rest_mony2","56337414e86d1a18d345e606":"badge_rest_mony3",
                "5633742ae86d1a18d345e608" : "badge_rest_wine","56337438e86d1a18d345e60c" : "badge_rest_view",
                "56337450e86d1a18d345e60e":"badge_rest_music","5633745be86d1a18d345e610":"badge_rest_breakfast",
                "56337481e86d1a18d345e615": "badge_rest_kids","5633748ce86d1a18d345e617":"badge_rest_hookah",
                "5633746ee86d1a18d345e613":"badge_rest_private","573ae9e83f1806063cd6359c":"badge_rest_terrace"
        }
    }
    componentDidUpdate(){
        $('#' + this.props.item._id).find(".rating_type_1").raty({
            numberMax : 5,
            half: true,
            halfShow: true,
            starHalf : '/img/svg/find_star_half_01.svg',
            starOff : '/img/svg/find_star_empty.svg',
            starOn : '/img/svg/find_star_full.svg',
            score: function() {
                return $(this).attr('data-score') || 1;
            },
            score2: function() {
                return $(this).attr('data-user-score') || 0;
            }
        })
    }
    recalcPic(e){
        const   $img = $(e.target),
            pic_height = $img.height(),
            pic_parent_height = $img.closest('.event_collection_item').height()
        if (pic_height >= pic_parent_height) {
            const height_diff = Math.abs(pic_height - pic_parent_height);
            $img.css({'marginTop': -1 * height_diff/2});
        }
    }
    likeItem(e){
        e.stopPropagation()
        e.preventDefault()
        this.setState({like : this.state.like == "" ? "liked" : ""})
    }
    michelin_stars(count){
        let arr = []
        while(count--) arr.push(true)
        return (
            <td className="rest_raiting_middle">
                <span className="badge_rest_michelin" />
                {arr.map(()=> {return <span className="badge_rest_michelin_star" />})}
            </td>
        )
    }
    _formatD(m){
        var res = "";
        if(m && !isNaN(m)){
            var d = m/1000 ^ 0, dd = m % 1000;
//        if(d > 100){
//            res = "";
//        }else
            if(d < 1){
                res = Math.round(dd) + " m";
            }else{
                switch(true){
                    case dd < 250 : res = d + ' km';break;
                    case dd < 750 : res = d +',5 km';break;
                    default : res = (d + 1) +' km';break
                }
            }
        }
        return res
    }
    render(){
        const { item } = this.props
        const icons = this.icons
        const src = item.files && item.files.length ? (item.files[1] ? item.files[1].src : item.files[0].src) : '';
        const item_icons = (item.icons || []).map(function(i){ return i._id});
        return (
            <div id={item._id} className={item.new_till ? "event_collection_item prime_new" : "event_collection_item"}>
                <Link to={item.inner_link}>
                    <div className="event_collection_item_picture">
                        <img onLoad={this.recalcPic} src={src} alt="" />
                        <div className="clear"></div>
                    </div>

                    <div className="event_collection_item_top">
                        <div className="event_collection_item_line">
                            <div onClick={this.likeItem} className={"event_collection_item_like " + this.state.like}></div>
                            <div className="clear"></div>
                        </div>
                    </div>

                    <div className="event_collection_item_bottom">
                        <div className="event_collection_item_line">
                            <div className="event_collection_item_name">{item.name}</div>
                            <div className="event_collection_item_distance">{this._formatD(item.dist)}</div>
                            <div className="clear"></div>
                        </div>

                        <div className="event_collection_item_line">
                            <table className="icons_system">
                                <tbody>
                                <tr>
                                    <td className="icons_system_left">
                                        <div className="event_collection_item_badges">
                                            {item_icons.map((icon, i)=>{return <span key={i} className={icons[icon]} />})}
                                        </div>
                                    </td>
                                    <td className="icons_system_middle">
                                        <table className="rest_raiting">
                                            <tbody>
                                            <tr>
                                                <td className="rest_raiting_left" >
                                                    <span className="badge_50rest"></span>
                                                </td>

                                                {item.rating_mishlen ? this.michelin_stars(item.rating_mishlen) : <td />}
                                                {item.rating_zagat ? (
                                                    <td className="rest_raiting_right">
                                                        <span className="badge_rest_zagate"></span>
                                                        <span className="badge_rest_zagate_number">{item.rating_zagat}</span>
                                                    </td>
                                                ) : <td />}
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className="icons_system_right">
                                        <div className="event_collection_item_rating rating_type_1" data-score={item.rating} data-user-score="1" />
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <div className="clear"></div>
                        </div>
                        <div className="clear"></div>
                    </div>
                </Link>
            </div>
        )
    }
}