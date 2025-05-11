import ResponsiveAppBar from "./components/AppBar";
import TechStackSection from "./sections/TechStackSection";
import ArchitectureSection from "./sections/ArchitectureSection";
import SourceCodeSection from "./sections/SourceCodeSection";
import DemoSection from "./sections/DemoSection";
function App() {
  return (
    <div>
      <ResponsiveAppBar />
      <DemoSection />
      <TechStackSection />
      <ArchitectureSection />
      <SourceCodeSection />
      <footer
        style={{
          textAlign: "center",
          padding: 20,
          position: "relative",
        }}
      >
        <p>
          Made with ❤️ by <span style={{ fontWeight: "bold" }}>Vin Souza</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
