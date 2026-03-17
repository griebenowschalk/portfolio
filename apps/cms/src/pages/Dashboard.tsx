import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useProjects } from "../hooks/useProjects";
import { useSkills } from "../hooks/useSkills";
import { useExperience } from "../hooks/useExperience";
import { Folder, Award, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { formatRelativeTime } from "../lib/utils";

const Dashboard: React.FC = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { experience, isLoading: experienceLoading } = useExperience();

  const stats = [
    {
      name: "Projects",
      value: projects.length,
      icon: Folder,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      link: "/projects",
    },
    {
      name: "Skills",
      value: skills.length,
      icon: Award,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      link: "/skills",
    },
    {
      name: "Experience",
      value: experience.length,
      icon: Briefcase,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      link: "/experience",
    },
    {
      name: "Featured",
      value: projects.filter((p) => p.featured).length,
      icon: TrendingUp,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
      link: "/projects",
    },
  ];

  const isLoading = projectsLoading || skillsLoading || experienceLoading;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your portfolio content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.name} to={stat.link}>
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.name}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {isLoading ? "..." : stat.value}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your latest portfolio projects
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No projects yet. Create your first one!
                </p>
                <Button asChild>
                  <Link to="/projects">Create Project</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {project.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.category} •{" "}
                        {formatRelativeTime(project.updatedAt ?? "")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
