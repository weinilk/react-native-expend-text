import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Image, StyleSheet, Text,TouchableOpacity} from 'react-native';
export var ExpandType = {
    //展开按钮在文字末尾
    tailType : 0,
    //展开按钮在文字下方
    belowType : 1  
}

class Expendext extends Component {
    static propTypes = {
        style: Text.propTypes.style,
        expandTextStyle:Text.propTypes.style,
        numberOfLines: PropTypes.number
    }
    constructor(props){
        super(props);
        this.state = {
            /** 文本是否展开 */
            expanded:true,
            numberOfLines:null,
            /** 展开收起文字是否处于显示状态 */
            showExpandText:false,
            expandText:'展开',
            /** 是否处于测量阶段 */
            measureFlag:true
        }
        this.numberOfLines = props.numberOfLines;
        this.expandType = props.expandType;
        /** 文本是否需要展开收起功能：（实际文字内容是否超出numberOfLines限制） */
        this.measureFlag = true;
        this.haseDetail = props.haseDetail || false
    }


    _onTextLayout(event){
        if(this.measureFlag){
            if(this.state.expanded){
                this.maxHeight = Math.ceil(parseInt(event.nativeEvent.layout.height.toString()));
                this.setState({expanded:false,numberOfLines:this.numberOfLines});
            }else{
                this.mixHeight = Math.ceil(parseInt(event.nativeEvent.layout.height.toString()));
                if(this.mixHeight == this.maxHeight){
                    this.setState({showExpandText:false})
                }else{
                    this.setState({showExpandText:true})
                }
                this.measureFlag = false;
            }
        }

    }

    _onPressExpand(){
        if(!this.state.expanded){
            this.setState({numberOfLines:null,expandText:'收起',expanded:true})
        }else{
            this.setState({numberOfLines:this.numberOfLines,expandText:'展开',expanded:false})
        }
    }
    _toDetail(){
        if (this.props.detailClick) {
            this.props.detailClick()
        }
    }

    render() {
        const { numberOfLines, ...rest } = this.props;
        return (
            <View>
                <Text numberOfLines={this.state.numberOfLines} ellipsizeMode={'tail'}
                    onLayout={this._onTextLayout.bind(this)}
                    {...rest}
                >
                    {this.props.children}
                </Text>
                {this.renderExpandText()}
            </View>
        );
    }

    renderExpandText(){
        const {expandTextStyle,expandType} = this.props;
            if (expandType == ExpandType.tailType) {
                let expandText = this.state.showExpandText?(<View style={{flexDirection:'row'}}>
                    {!this.state.expanded?<Text style={[expandTextStyle,{backgroundColor:'white'}]} onPress={this._onPressExpand.bind(this)}>...</Text>:null}
                    <Text style={[styles.expandText,expandTextStyle,{backgroundColor:'white'}]} onPress={this._onPressExpand.bind(this)}>
                        {this.state.expandText}
                    </Text>
                </View>
            ) : null;
            return (
                <View style={[{flexDirection:'row',position:"absolute",bottom:0,right:0}]}>
                    <View style={{flex:1}}/>
                    {expandText}
                </View>
            )
        }else if (expandType == ExpandType.belowType) {
            let isShowExpand = this.state.showExpandText || this.haseDetail
            let expandText = this.state.showExpandText?(<View style={{flexDirection:'row'}}>
                    <Text style={[styles.expandText,expandTextStyle,{backgroundColor:'white'}]}>
                        {this.state.expandText}
                    </Text>
                </View>
            ) : null;
            return (
                <View>
                    {isShowExpand?<View style={{height:1,flex:1,backgroundColor:'rgb(229,229,229)',marginVertical:10}}/>:null}
                    <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
                        {this.haseDetail?<TouchableOpacity onPress={this._toDetail.bind(this)} activeOpacity={1} style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={[styles.expandText,expandTextStyle,{backgroundColor:'white'}]}>查看详情</Text>
                            <Image style={{width:9,height:15,marginLeft:7}} source = {require('../Image/xiangqing.png')}/>
                        </TouchableOpacity>:<View/>}
                        {this.state.showExpandText?<TouchableOpacity onPress={this._onPressExpand.bind(this)} activeOpacity={1} style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            {expandText}
                            <Image style={{width:15,height:9,marginLeft:7,transform: this.state.expanded?[{rotate:'180deg'}]:[{rotateX:'0deg'}]}}
                            source = {require('../Image/text_zhankai.png')}/>
                        </TouchableOpacity>:<View/>}
                    </View>
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    expandText: {
        color:'#1fdb9b',
        marginTop:0
    }


});

export default Expendext;
