import Link from "next/link";


const Navbar = () => {
    console.log('main nav Rendered');
    return (
        <div className="flex justify-between sticky top-0 z-50 print:hidden bg-[#282A35]">
            <div>
                <Link className="inline-block py-2 px-4 hover:bg-black hover:text-white text-lg font-bold text-[#D3D3D3]" href="/">Home</Link>
                <Link className="inline-block py-2 px-4 hover:bg-black hover:text-white text-lg font-bold text-[#D3D3D3]" href="/projection">Projection</Link>
                <Link className="inline-block py-2 px-4 hover:bg-black hover:text-white text-lg font-bold text-[#D3D3D3]" href="/purchase_requisition">Purchase Requisition</Link>

            </div>
            <div>
                <Link className="inline-block py-2 px-4 hover:text-white text-lg font-bold text-[#D3D3D3]" href="/test">Test</Link>
                <Link className="inline-block py-2 px-4 hover:text-white text-lg font-bold text-[#D3D3D3]" href="/environment">Environment Setup</Link>

            </div>

        </div>
    );
};

export default Navbar;