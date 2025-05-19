import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';

import { Router } from './Router.jsx';
import { queryClient } from './utils/queryOptions.ts';

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router />
		</QueryClientProvider>
	</React.StrictMode>,
);
