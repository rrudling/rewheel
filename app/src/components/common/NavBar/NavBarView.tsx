import React from 'react';
import Button1 from '../buttons/Button1View';
import ReWheelLogo from '../ReWheelLogo';
import HamburgerButton from './HamburgerBtn';

import { NavButton } from './NavBarPresenter';

interface Props {
	navButtons: NavButton[];
	navButtonClickHandler: Function;
}

const DesktopNavBarView = ({ navButtons, navButtonClickHandler }: Props) => {
	const desktopView = (
		<div className="flex h-max">
			{navButtons.map((navButton) => (
				<Button1
					key={'navBarView ' + navButton.text}
					color="green"
					text={navButton.text}
					onClickHandler={() => navButtonClickHandler(navButton.route)}
				/>
			))}
		</div>
	);

	const mobileView = <div></div>;

	return (
		<div className="fixed top-0 w-full z-50">
			<div className="h-1 bg-green-500 w-full" />
			<div
				className={`
                    flex justify-between items-center 
                    h-12 px-4
                    bg-white 
                    border-b 
                    border-gray-300
                `}
			>
				<ReWheelLogo />

				{desktopView}

				{/* <HamburgerButton
					showingModal={true}
					onClickHandler={() => console.log('Clicked')}
				/> */}
			</div>
		</div>
	);
};

export default DesktopNavBarView;
