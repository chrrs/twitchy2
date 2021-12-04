import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import 'virtual:windi.css';

ReactDOM.render(
	<StrictMode>
		<div className="text-red-500">Hello!</div>
	</StrictMode>,
	document.getElementById('root')
);
