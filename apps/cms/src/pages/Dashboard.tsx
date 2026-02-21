import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useProjects } from "../hooks/useProjects";
import { useSkills } from "../hooks/useSkills";
import { useExperience } from "../hooks/useExperience";
import { Folder, Award, Briefcase, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { experience, isLoading: experienceLoading } = useExperience();

  const stats = [
    {
      name: "Projects",
      value: projects.length,
      icon: Folder,
      color: "bg-blue-500",
      link: "/projects",
    },
    {
      name: "Skills",
      value: skills.length,
      icon: Award,
      color: "bg-green-500",
      link: "/skills",
    },
    {
      name: "Experience",
      value: experience.length,
      icon: Briefcase,
      color: "bg-purple-500",
      link: "/experience",
    },
    {
      name: "Featured Projects",
      value: projects.filter((p) => p.featured).length,
      icon: TrendingUp,
      color: "bg-yellow-500",
      link: "/projects",
    },
  ];

  const isLoading = projectsLoading || skillsLoading || experienceLoading;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your portfolio content
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                to={stat.link}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isLoading ? "..." : stat.value}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Projects
          </h2>
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No projects yet.{" "}
              <Link to="/projects" className="text-blue-600 hover:underline dark:text-blue-400">
                Create one
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.category}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.featured
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    {project.featured ? "Featured" : project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
