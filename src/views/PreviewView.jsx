import React from 'react';
import {Link} from 'react-router';
import { 
	Button,
	Slide, 
	Slider, 
} from 'react-materialize';

export default class PreviewView extends React.Component {

    render () {
        return (
            <div>
                <h1>Preview</h1>

				<Slider>
					<Slide
						src=""
						title="">
						Preview
					</Slide>
					<Slide
						src=""
						title=""
						placement="left">
						Preview
					</Slide>
					<Slide
						src=""
						title=""
						placement="right">
						Preview
					</Slide>
				</Slider>

				<div>
					<Button waves='light'>Save</Button>
					<Button waves='light'>Publish</Button>
				</div>

            </div>
        );
    }
}