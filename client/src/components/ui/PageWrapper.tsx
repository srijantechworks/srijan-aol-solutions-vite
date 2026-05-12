import type {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

export default function PageWrapper({children}: Props) {
    return (<div className="relative w-full"> {children} </div>);
}