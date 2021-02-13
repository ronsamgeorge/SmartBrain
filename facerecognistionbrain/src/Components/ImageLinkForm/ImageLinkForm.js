import React from 'react';
import './ImageLinkForm.css'


const ImageLinkForm = ({onInputChange , onButtonSubmit}) => {
    return (
        <div>
            <p className ='f3'>
                {"This is Smart Brain. A face detecting website for your images, using CLAIRE API"}
            </p>
            <div className ='center'>
                <div className =' form pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center pd5' type ="text" onChange={onInputChange}/>
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple mv2" onClick = {onButtonSubmit}>Detect</button>
                  </div>
            </div>
        </div>

    );
}

export default ImageLinkForm;