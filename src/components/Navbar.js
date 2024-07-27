import Link from "next/link";


const Navbar = () => {
    return (
        <div className="flex bg-slate-700 justify-between sticky top-0 z-50 print:hidden">
            <div>
                <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/">Home</Link>
                <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/projection">Projection</Link>
                <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/purchase_requisition">Purchase Requisition</Link>

            </div>
            <div>
                <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/test">Test</Link>
                <Link className="inline-block py-2 px-4 hover:bg-slate-500 text-lg font-bold text-white" href="/environment">Environment Setup</Link>

            </div>

        </div>
    );
};

export default Navbar;