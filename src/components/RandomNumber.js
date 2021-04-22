import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

class RandomNumber extends Component{
    static propTypes = {
        number: PropTypes.number.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
    }
    handlePress =()=>{
        if (this.props.isDisabled) return;
        const {id, onPress}= this.props
        onPress(id)
    }
    render(){
        const {number, isDisabled} = this.props;
        return(
            <TouchableOpacity onPress={this.handlePress}>
                <Text style={[styles.number, isDisabled && styles.disabled]}>{number}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    number: {
        fontSize: 35,
        backgroundColor: '#999',
        width: 100,
        marginHorizontal: 15,
        marginVertical: 25,
        textAlign: 'center',    
    },
    disabled: {
        opacity: 0.5,
    }
})
export default RandomNumber;