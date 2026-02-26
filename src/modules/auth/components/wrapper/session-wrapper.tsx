"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";
import { useRef } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const clientRef = useRef(getQueryClient());

	return (
		<SessionProvider>
			<QueryClientProvider client={clientRef.current}>
				{children}
			</QueryClientProvider>
		</SessionProvider>
	);
}