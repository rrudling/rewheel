import React from 'react';

import SpinnerImg from '../../resources/images/wheel_with_color.png';

const Spinner = () => {
	return <img src={SpinnerImg} className="w-20 h-20 animate-spin-slow" />;
};

export default Spinner;
