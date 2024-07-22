import Link from "next/link";
import { Chip } from "@nextui-org/react";
import { db } from "@/db";
import paths from "@/paths";

async function TopicList() {
  const topicsList = await db.topic.findMany();

  const content = topicsList.map((topic) => {
    return (
      <li key={topic.id}>
        <Link href={paths.topicShow(topic.slug)}>
          <Chip color="warning" variant="shadow">
            {topic.slug}
          </Chip>
        </Link>
      </li>
    );
  });

  return <ul className="flex flex-row gap-2 flex-wrap">{content}</ul>;
}

export default TopicList;
