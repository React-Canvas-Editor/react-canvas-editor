import "./navbar.css";
export default function Navbar(props) {
    return (
        <nav class="navbar">
            <a class="active" href="#"> React Canvas Editor</a>
           {props.children}
        </nav>
    );
}