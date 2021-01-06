import React, { Component } from 'react';
import { ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Button,  Alert, Toggle } from 'rsuite';
import axios from 'axios';
import { gameServer } from '../config';

class AddAsset extends Component {
	state = { 
		formValue: {
			name: '',
			description: '',
		},
		assetBoolean: null,
		id: ''
	 }
		
	 componentDidMount = () => {
		 const char = this.props.character;
		 this.setState({ id: char._id, assetBoolean: false });
	 }

	 handleSubmit = async () => {
		// 1) make a new asset
		const formValue = {
			asset: {
				name: this.state.formValue.name,
				description: this.state.formValue.description,	
				model: this.state.assetBoolean ? 'Asset' : 'Trait'							
			},
			id: this.props.character._id, 
	 }
		try{
			await axios.patch(`${gameServer}api/characters/newAsset`, { data: formValue });
			Alert.success('Character Successfully Modify');
			this.props.closeModal()
		}
		catch (err) {
      Alert.error(`Error: ${err.response.data}`, 5000);
		}
	 }

	render() { 
		return ( 
			<Modal
			overflow
			size='md'  
			show={this.props.show} 
			onHide={() => this.props.closeModal()}>
				<Modal.Header>
					<Modal.Title>Create new Asset/Trait</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form layout="center" formValue={this.state.formValue}  onChange={formValue => {this.setState({ formValue }); }}>
						<FlexboxGrid>
							<FlexboxGrid.Item colspan={12}>
								<FormGroup>
									<ControlLabel>Asset Name </ControlLabel>
									<FormControl name="name" />
							</FormGroup>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={12}>
								<FormGroup>
									<ControlLabel>Asset/Trait </ControlLabel>
									<FormControl accepter={this.myToggle} name='asset' />
							</FormGroup>
							</FlexboxGrid.Item>
						</FlexboxGrid>
						<FormGroup>
								<ControlLabel>Asset Description</ControlLabel>
								<FormControl style={{width: '100%'}} name="description" rows={5} componentClass="textarea" />
							</FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
          <Button onClick={() => this.handleSubmit()} appearance="primary">
            Submit
          </Button>
          <Button onClick={() => this.props.closeModal()} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
			</Modal>
		 );
	}

	myToggle = () => {
		return (
			<Toggle onChange={()=> this.setState({ assetBoolean: !this.state.assetBoolean })} checkedChildren="Asset" unCheckedChildren="Trait">
				
			</Toggle>			
		)

	}
}
 
export default AddAsset;