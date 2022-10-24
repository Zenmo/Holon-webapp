import { useState } from "react";
import StorylineOverviewCard from "./StorylineOverviewCard";
import StorylineOverviewFilter from "./StorylineOverviewFilter";

export default function StorylineOverview({ storylines }) {
  //const uniqueRoles = [...new Set(config.map((item) => item.b))];
  const roleArray = [...new Set(storylines.items.map(item => item.role))];
  const uniqueRoles = [...new Set(roleArray.reduce((o, c) => o.concat(c), []))];

  const informationArray = [...new Set(storylines.items.map(item => item.informationtype))];
  const uniqueInformation = [...new Set(informationArray.reduce((o, c) => o.concat(c), []))];

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedInformation, setSelectedInformation] = useState<string[]>([]);

  const updateRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(prevArray => [...prevArray.filter(item => item !== role)]);
    } else {
      setSelectedRoles(prevArray => [...prevArray, role]);
    }
  };

  const updateInformation = (information: string) => {
    if (selectedInformation.includes(information)) {
      setSelectedInformation(prevArray => [...prevArray.filter(item => item !== information)]);
    } else {
      setSelectedInformation(prevArray => [...prevArray, information]);
    }
  };

  const filteredProjects = storylines.items
    .filter(project =>
      selectedRoles.length > 0 ? selectedRoles.some(r => project.role.indexOf(r) >= 0) : project
    )
    .filter(project =>
      selectedInformation.length > 0
        ? selectedInformation.some(r => project.informationtype.indexOf(r) >= 0)
        : project
    );

  return (
    <div className="flex w-full flex-col lg:flex-row">
      {/* <div className="flex flex-col p-8  lg:flex-row">
        <h1>Welkom</h1>
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
          sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
          diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
          gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
          amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
          et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
          amet.
        </p>
      </div> */}
      <div className="flex flex-col p-8 lg:w-1/3 xl:w-1/4">
        <StorylineOverviewFilter
          title="Type rol"
          name="role"
          items={uniqueRoles}
          selectedItems={selectedRoles}
          update={updateRole}
        />
        <StorylineOverviewFilter
          title="Type informatie"
          name="information"
          items={uniqueInformation}
          selectedItems={selectedInformation}
          update={updateInformation}
        />
      </div>
      <div className="flex flex-col p-8 lg:w-2/3 xl:w-3/4">
        <div className="flex flex-row justify-between mb-2">
          <strong>{filteredProjects.length} resultaten</strong>
          <strong>Sorteren placenholder</strong>
        </div>

        <div className="flex flex-row flex-wrap storyline__grid">
          {filteredProjects.map((project, index) => (
            <StorylineOverviewCard key={index} index={index} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
