import React from "react";
import { StyleSheet, View, Text, Button} from "react-native";
import { WebView } from "react-native-webview";


class WebViewTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "React Native WebView Sample",
            text2: "no data"
        }
    }

    handleDataReceived = msgData => {
        this.setState({
            text2: `Message from web view ${msgData.data}`
        });
        msgData.isSuccessful = true;
        msgData.args = [msgData.data % 2 ? "green" : "red"];
        this.postMessage(JSON.stringify(msgData));
    }

    onWebViewMessage = event => {
        console.log('on message: ', event.nativeEvent);

        this.postMessage(event.nativeEvent.data);

        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data);
        }
        catch(error) {
            console.warn(error);
            return;
        }

        console.log('message data: ', msgData);

        switch(msgData.targetFunc) {
            case "handleDataReceived":
                this.handleDataReceived(msgData);
                break;
            default:
                break;
        }
    }

    postMessage = message => {
        this.myWebView.postMessage(message);
    }

    sendMessage = () => {
        this.postMessage(JSON.stringify({
            type: 'message',
            payload: 'A message from React Native'
        }))
    }

    render() {
        console.log('rendering...');
        return (
            <View style={styles.container}>
            <Text style={styles.welcome}>{this.state.text}</Text>
            <Text style={styles.welcome}>{this.state.text2}</Text>
            <Button onPress={() => { this.sendMessage(); }} title="Send to web page" />
            <View style={styles.webViewContainer}>
                <WebView
                    ref={view => { this.myWebView = view; }}
                    source={require('./page.html')}
                    javaScriptEnabled={true}
                    onMessage={this.onWebViewMessage}
                />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flex: 1,
      justifyContent: "center"
    },
    welcome: {
      paddingTop: 20,
      fontSize: 20,
      textAlign: "center",
      backgroundColor: "skyblue"
    },
    webViewContainer: {
      flex: 4
    }
  });

export default WebViewTest;