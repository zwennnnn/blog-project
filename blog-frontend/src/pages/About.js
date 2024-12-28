import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Hakkımızda</h1>
                <div className="prose max-w-none text-gray-600">
                    <p className="mb-4">
                        Zwennnn Blog, teknoloji ve yazılım dünyasındaki en güncel gelişmeleri,
                        trend konuları ve derinlemesine teknik içerikleri sizlerle buluşturan
                        bir platform olarak hizmet vermektedir.
                    </p>
                    <p>
                        Amacımız, kaliteli ve özgün içeriklerle okuyucularımıza değer katmak,
                        bilgi paylaşımını artırmak ve teknoloji topluluğuna katkıda bulunmaktır.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
