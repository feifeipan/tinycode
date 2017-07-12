import React from 'react';

class NewReactComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {

            };
        }

        componentWillMount() {
            var params = this.props.match.params;
        }

        componentDidMount() {
	  console.log('NewReactComponent componentDidMount', this.props);
        }

         componentWillReceiveProps(nextProps){
         	  console.log('NewReactComponent componentWillReceiveProps', nextProps);
         }
}

export default NewReactComponent;
