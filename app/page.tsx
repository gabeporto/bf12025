// app/page.tsx
import React from 'react';
import { F1_GPS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { F1_THEME } from '@/lib/theme';
import { Flag } from 'lucide-react';
import { BettingTable } from '@/components/betting-table';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[url('/images/f1-background.png')] bg-cover bg-center">
            <div className="min-h-screen bg-gray-900 py-12 px-4">
                <div className="container mx-auto max-w-7xl">
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {F1_GPS.map((gp, index) => (
                            <Link
                                key={gp.id}
                                href={gp.active ? `/${gp.id}` : '#'}
                                passHref
                            >
                                <Card
                                    className={`border-0 shadow-xl overflow-hidden cursor-pointer ${!gp.active ? 'opacity-50 pointer-events-none cursor-none' : ''
                                        }`}
                                >
                                    <CardHeader
                                        className="text-white"
                                        style={{
                                            background: F1_THEME.gradients.header,
                                            borderBottom: `4px solid ${F1_THEME.primary}`,
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            <Flag size={24} className="text-white" />
                                            <CardTitle className="text-xl font-bold text-center">{gp.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 bg-white">
                                        <p>Corrida {index + 1}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </section>
                </div>
            </div>
        </div >
    );
}
