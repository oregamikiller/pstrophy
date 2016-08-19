'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
        Image,
        ListView,
        TouchableHighlight,
        StyleSheet,
        RecyclerViewBackedScrollView,
        Text,
        View,
        TextInput,
        BackAndroid,
        } = ReactNative;


var MainList = React.createClass({
    statics: {
        title: '<ListView>',
        description: 'Performant, scrollable list of data.'
    },

    componentDidMount: function () {
        var self = this;
        BackAndroid.addEventListener('hardwareBackPress', function () {
            if (self.props.navigator.getCurrentRoutes().length > 1) {
                return true;
            } else {
                return false;
            }
        });
        this.fetchData();
    },
    fetchData: function () {
        fetch('http://semidream.com/trophydata')
            .then((response) => response.json())
            .then((responseData) => {
                remoteData = responseData;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(remoteData),
                    loaded: true,
                });
            })
            .done();
    },

    fetchNext: function () {
        let page = parseInt(this.state.dataSource.getRowCount() / 20) + 1;
        console.log(page);
        if (!searchFlag) {
            fetch('http://semidream.com/trophydata/' + page)
                .then((response) => response.json())
                .then((responseData) => {
                    remoteData = remoteData.concat(responseData);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(remoteData),
                        loaded: true,
                    });
                })
                .done();
        }
    },
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false,
        }
    },


    render: function () {
        return (
            <View style={styles.container}>
                <TextInput style={styles.searchbox}
                           placeholder="请输入想搜索游戏的标题"
                           returnKeyType="search"
                           keyboardType="default"
                           onChangeText={text => this.SearchTitle(text)}
                    />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                    renderSeparator={this._renderSeperator}
                    //onEndReached={this.fetchNext}
                    //onEndReachedThreshold={20}
                    />
            </View>
        );
    },

    _renderRow: function (rowData:string, sectionID:number, rowID:number) {
        var rowHash = Math.abs(hashCode(rowData));
        return (
            <TouchableHighlight onPress={() => this.pressRow(rowID)}>
                <View>
                    <View style={styles.row}>
                        <Image style={styles.thumb} source={{uri:rowData.picUrl}}/>
                        <Text style={styles.text}>
                            {rowData.title } {"\n"} {rowData.desc}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },

    SearchTitle: function (text) {
        if (text.length >= 1) {
            searchFlag = true;
            fetch('http://semidream.com/trophydata/title/' + text)
                .then((response) => response.json())
                .then((responseData) => {
                    remoteData = responseData;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(remoteData),
                        loaded: true,
                    });
                })
                .done();
        } else {
            searchFlag = false;
            this.fetchData();
        }
    },

    pressRow: function (rowID:number) {
        console.log(remoteData[rowID].url);
        this.props.navigator.push({

            name: 'detail',
            gameid: remoteData[rowID].id
        });
    },

    _renderSeperator: function (sectionID:number, rowID:number, adjacentRowHighlighted:bool) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
                />
        );
    }


});

var remoteData = [];
var searchFlag = false;

var hashCode = function (str) {
    var hash = 15;
    for (var ii = str.length - 1; ii >= 0; ii--) {
        hash = ((hash << 5) - hash) + str.charCodeAt(ii);
    }
    return hash;
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    searchbox: {
        marginTop: 20,
        padding: 3,
        fontSize: 20,
        borderColor: 'red',
        borderWidth: 1,
        height: 30,
        paddingLeft: 8,
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: '#F6F6F6',
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    thumb: {
        width: 100,
        height: 55,
        margin: 5,
    },
    text: {
        margin: 5,
        flex: 1,
    },
});

module.exports = MainList;
