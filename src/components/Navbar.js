import Link from "next/link";


const Navbar = () => {
    return (
        <div className="flex bg-green-600">
            <Link className="inline-block py-2 px-4 hover:bg-green-500 text-lg font-bold text-white" href="/">Home</Link>
            <Link className="inline-block py-2 px-4 hover:bg-green-500 text-lg font-bold text-white" href="/projection">Projection</Link>
            <Link className="inline-block py-2 px-4 hover:bg-green-500 text-lg font-bold text-white" href="/purchase_requisition">Purchase Requisition</Link>
            <Link className="inline-block py-2 px-4 hover:bg-green-500 text-lg font-bold text-white" href="/test">Test</Link>
        </div>
    );
};

export default Navbar;