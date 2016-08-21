import React, { Component } from 'react';
import { WebView } from 'react-native';


var targetUrl = false;
var DEFAULTUrl = 'http://semidream.com';

class CustomWebView extends Component {


    render() {
        console.log("aaaaaaabbbbbbbb");
        return (
            <WebView
                source={{uri: 'http://semidream.com'}}
                style={{marginTop: 20}}
                />
        );
    }
}

module.exports = CustomWebView;