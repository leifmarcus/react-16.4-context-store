import React from 'react';
import PropTypes from 'prop-types';

const testInitialState = {
    title : '',
    text  : '',
};

const storeMap = {
    test : ( state = testInitialState, action ) => {

        if ( action.type === 'UPDATE' ) {
            return {
                ...state,
                ...action.data,
            };
        }

        return {
            ...state,
        };
    },
};

/**
 *
 */
const createComponentState = ( state, action ) => {
    const storeIterable = Object.entries( storeMap );

    return storeIterable.reduce( ( newState, [ key, reducerFn ] ) => {
        newState[ key ] = reducerFn( state[ key ], action );

        return newState;
    }, {} );
};

/**
 * main dispatch function
 *
 * @param {Component} component React component instance
 *
 * @returns {Function} dispatch function
 */
const createDispatch = ( component ) => {

    /**
     * dispatch function
     *
     * @param {Function|Object} action
     * @return {Object} new state or undefined
     */
    const dispatch = ( action ) => {
        if ( typeof action === 'function' ) {
            return action( dispatch );
        }

        const { state = {} } = component;
        const newState = createComponentState( state, action );

        if ( action.type.startsWith( 'RETURN_' ) ) {
            return newState;
        }

        component.setState( newState );
    };

    return dispatch;
};


export const MainContext = React.createContext();

/**
 * Main store provider
 */
export default class MainProvider extends React.Component {
    static propTypes = {
        children : PropTypes.node,
    };

    /**
     * Creates an instance of MainProvider.
     * @param {Object} props
     * @param {Object} context
     */
    constructor( props, context ) {
        super( props, context );


        this.dispatch = createDispatch( this );

        this.state = {
            ...this.dispatch( {
                type : 'RETURN_INITIAL_STATE',
            } ),
        };

    }

    fetchData = ( dispatch ) => {
        fetch( '/data/test.json' )
            .then( request => request.json() )
            .then( json => {
                dispatch( {
                    type : 'UPDATE',
                    data : json,
                } );
            } );
    }

    /**
     * fetching test data from test json
     */
    componentDidMount() {
        this.dispatch( this.fetchData );
    }

    /**
     * renders the provider
     *
     * @returns {Object} React Element
     */
    render() {
        const store = {
            state       : this.state,
            dispatch    : this.dispatch,
        };

        return (
            <MainContext.Provider value={ store }>
                { this.props.children }
            </MainContext.Provider>
        );
    }
}

/**
 *
 */
export const MainConsumer = ( props ) => {
    return (
        <MainContext.Consumer>
            {
                ( { state } ) => {
                    console.log(state);
                    return React.children.map( props.children, (test) => console.log( test ) );
                }
            }
        </MainContext.Consumer>
    );
};
