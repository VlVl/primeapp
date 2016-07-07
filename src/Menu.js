import React, { Component } from 'react'
import {Link} from 'react-router'

export default class Menu extends Component {
    componentWillReceiveProps(nextProps){
        if(nextProps.city !== this.props.city)
            this.props.getCuisines(nextProps.city)
    }
    toggleCuisine(e){
        const $el = $(e.currentTarget), $parent = $el.parent().parent()
        let option_set = []
        $el.toggleClass('selected');

        $el.parent().find('.sub_section_list_line').each(function(i, el) {
            if ($(el).hasClass('selected')) {
                option_set.push($(el).text());
            }
        });
        if (option_set.length === 0) {
            $parent().find('.sub_section_top').removeClass('active');
            $parent().find('.filter_choice').hide();
            $parent().find('.filter_title').css({'display':'inline-block'});
        } else {
            $parent().find('.sub_section_top').addClass('active');
            $parent().find('.filter_title').hide();
            $parent().find('.filter_choice').text(option_set);
            $parent().find('.filter_choice').css({'display':'inline-block'});
        }
    }
    toggleCuisines(e){
        const $el = $(e.currentTarget)
        $el.toggleClass('open');
        if ($el.hasClass('open')) {
            $el.siblings('.sub_section_list').slideDown();
        } else {
            $el.siblings('.sub_section_list').slideUp();
        }
    }
    toggleIcon(e){
        $(e.target).toggleClass('active')
    }
    search(){
        let obj = {}
        $("#main_menu").find(".selected, .active").each(function(){
            var arr = ($(this).attr("data-info") || ":").split(":");
            if(!obj[arr[0]])
                obj[arr[0]] = arr[1];
            else
                obj[arr[0]] += ("," + arr[1]);
        });
        this.props.toggleMenu()
        this.props.getList([
            'c?url=msk/collection/restaurants/all/&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter=' + JSON.stringify(obj),
            'c?url=msk/collection/clubs&pos={%22lat%22:55.748747599999994,%22lng%22:37.5629053}&filter='+ JSON.stringify(obj)
        ])
    }
    render() {
//        const { data } = this.props.categories;
        return (
            <div id="main_menu" className="main_menu">
                <div className="menu_header">
                    <table>
                        <tbody>
                        <tr>
                            <td className="menu_header_left">
                                <a href="javascript:;" onClick={this.props.toggleMenu} target="_self" className="menu_close"></a>
                            </td>
                            <td className="menu_header_middle">
                                <div className="headerTitle">Фильтр</div>
                            </td>
                            <td className="menu_header_right"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="menu_content">
                    <div className="search_panel">
                        <div className="search_options">

                            <div className="sub_section">
                                <div onClick={this.toggleCuisines} className="sub_section_top"><span className="filter_title">Кухня</span><span className="filter_choice"></span></div>

                                <div className="sub_section_list">
                                    {(this.props.cuisines || []).map( (c, i) => {
                                        return <div onClick={this.toggleCuisine} key={i} data-info={"cuisine:" + c.id} className="sub_section_list_line">{c.name}</div>
                                    })}
                                </div>
                            </div>

                            <div className="filter_menu_collection">
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="New:1"><i className="icon_fm_new"></i>Новые рестораны</div>
                                <table className="filter_menu_table">
                                    <tbody>
                                    <tr>
                                        <td className="filter_menu_table_left"><div onClick={this.toggleIcon} data-info="icon:563373b2e86d1a18d345e5fa" className="filter_menu_item icon"><i className="icon_fm_price_medium"></i></div></td>
                                        <td>&nbsp;</td>
                                        <td className="filter_menu_table_right"><div onClick={this.toggleIcon} data-info="icon:56337414e86d1a18d345e606" className="filter_menu_item icon"><i className="icon_fm_price_high"></i></div></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:5633742ae86d1a18d345e608"><i className="icon_fm_wine"></i>Авторская винная карта</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:573ae9e83f1806063cd6359c"><i className="icon_fm_terrace"></i>Веранда</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:56337438e86d1a18d345e60c"><i className="icon_fm_good_view"></i>Хороший вид</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:56337450e86d1a18d345e60e"><i className="icon_fm_music"></i>Живая музыка</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:5633745be86d1a18d345e610"><i className="icon_fm_breakfast"></i>Завтраки</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:5633746ee86d1a18d345e613"><i className="icon_fm_private"></i>Private dining</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:56337481e86d1a18d345e615"><i className="icon_fm_kids"></i>Child friendly</div>
                                <div onClick={this.toggleIcon} className="filter_menu_item" data-info="icon:5633748ce86d1a18d345e617"><i className="icon_fm_hookah"></i>Кальян</div>
                            </div>
                        </div>

                        <div onClick={this.search.bind(this)} className="search_button_panel"><div className="search_button"><span>Показать результаты</span></div></div>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
            )
    }
}
