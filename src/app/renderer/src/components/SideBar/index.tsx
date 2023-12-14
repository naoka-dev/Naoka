"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    FireIcon,
    BookmarkIcon,
    Cog6ToothIcon,
    PlusIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CreateListModal from "../CreateListModal";
import { useLiveQuery } from "dexie-react-hooks";
import { List, MediaCache, db } from "@/lib/db";
import { Mapping, MediaType } from "@/lib/types";
import styles from "./styles.module.css";

export default function SideBar() {
    const [isCreateListModalOpen, setIsCreateListModalOpen] =
        React.useState(false);

    return (
        <div className="w-60 h-screen bg-zinc-950 flex flex-col">
            <MenuButtons />
            <Lists
                isCreateListModalOpen={isCreateListModalOpen}
                setIsCreateListModalOpen={setIsCreateListModalOpen}
            />
            <UserProfile />
            <CreateListModal
                isOpen={isCreateListModalOpen}
                closeModal={() => {
                    setIsCreateListModalOpen(false);
                }}
            />
        </div>
    );
}

function MenuItem({
    icon,
    title,
    href,
}: {
    icon: JSX.Element;
    title: string;
    href: string;
}): JSX.Element {
    const pathname = usePathname();

    return (
        <Link
            href={href}
            className={
                "flex flex-row items-center p-2 gap-4 hover:bg-zinc-700 rounded transition cursor-pointer " +
                (pathname === href ? "bg-zinc-800" : "active:bg-zinc-800")
            }
        >
            {icon}
            <div>{title}</div>
        </Link>
    );
}

function IconButton({ icon }: { icon: JSX.Element }): JSX.Element {
    return (
        <button className="p-2 rounded hover:bg-zinc-700 transition active:bg-zinc-800">
            {icon}
        </button>
    );
}

function MenuButtons(): JSX.Element {
    return (
        <div className="pb-2">
            <div className="flex flex-row items-stretch">
                <div className="p-2">
                    <IconButton icon={<Bars3Icon className="w-6 h-6" />} />
                </div>
                <div className="flex-1 draggable"></div>
            </div>
            <div className="flex flex-col p-2">
                <MenuItem
                    icon={<MagnifyingGlassIcon className="w-6 h-6" />}
                    title="Search"
                    href="/search"
                />
                {/* <MenuItem
                    icon={<FireIcon className="w-6 h-6" />}
                    title="Explore"
                    href="/"
                 /> */}
                <MenuItem
                    icon={<BookmarkIcon className="w-6 h-6" />}
                    title="My library"
                    href="/library"
                />
            </div>
        </div>
    );
}

function List({ list }: { list: List }) {
    const images = list.itemCaches!.map((v) => v.imageUrl);
    const title = list.name;
    const subtitle =
        list.items.length > 0
            ? `${list.items.length} item${list.items.length > 1 ? "s" : ""}`
            : "No items";

    return (
        <Link
            href={`/list?id=${encodeURIComponent(list.id!)}`}
            className="hover:bg-zinc-800 transition rounded p-2 -m-2 group flex flex-row items-center gap-2"
        >
            {images.length < 2 ? (
                <div className="w-8 h-8 rounded bg-zinc-800 flex flex-col items-center justify-center group-hover:bg-zinc-700 transition">
                    <RectangleStackIcon className="h-4 w-4 text-zinc-500 stroke-2" />
                </div>
            ) : (
                <div className="h-8 w-8 relative">
                    <img src={images[0]!} className="rounded absolute top-0 left-0 bottom-0 aspect-cover object-center object-cover h-full z-10" />
                    <img src={images[1]!} className="rounded absolute top-0 right-0 bottom-0 aspect-cover object-center object-cover h-full" />
                </div>
            )}
            <div className="flex-1 flex flex-col items-start">
                <div className="text-sm text-zinc-200 line-clamp-1">
                    {title}
                </div>
                <div className="text-xs text-zinc-400 line-clamp-1">
                    {subtitle}
                </div>
            </div>
        </Link>
    );
}

function Lists({
    isCreateListModalOpen,
    setIsCreateListModalOpen,
}: {
    isCreateListModalOpen: boolean;
    setIsCreateListModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
    const lists = useLiveQuery(() =>
        db.lists.toArray(async (lists) => {
            let itemCacheMappings: Array<Mapping> = [];

            for (const list of lists) {
                list.items.map((mapping: Mapping) =>
                    itemCacheMappings.push(mapping)
                );
            }

            const itemCaches: MediaCache[] = (await db.mediaCache.bulkGet([
                ...new Set(itemCacheMappings),
            ])) as MediaCache[];

            return lists.map((list) => {
                list.itemCaches = itemCaches.filter((v) =>
                    list.items.includes(v!.mapping)
                );
                return list;
            });
        })
    );

    return (
        <div
            className={`flex-1 overflow-y-auto border-y border-zinc-900 py-4 px-3 flex flex-col gap-4 ${styles.sidebarLists}`}
        >
            <div className="flex flex-row items-center justify-between">
                <div className="uppercase text-white/50 text-xs">My lists</div>
                <div className="flex flex-row items-center gap-2 -my-0.5">
                    <button
                        className="text-white/50 hover:text-white/70 transition"
                        onClick={() => setIsCreateListModalOpen(true)}
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {lists ? (
                lists.length > 0 ? (
                    lists.map((list, index) => (
                        <List key={list.id} list={list} />
                    ))
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-zinc-300 text-sm">
                        <div className="mb-1">(⩾﹏⩽)</div>
                        <div>There's nothing here!</div>
                        <div className="opacity-50 text-xs">
                            (You can create a new list on top!)
                        </div>
                    </div>
                )
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="h-4 w-4 border-2 border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}

function UserProfile() {
    return (
        <div className="p-2 relative flex flex-row items-center gap-2">
            <button className="flex flex-row items-center gap-4 transition hover:bg-zinc-800 w-full rounded">
                <img
                    src="/icon.jpg"
                    className="h-10 w-10 rounded object-cover object-center"
                />
                <div className="flex flex-col gap-1 flex-1 items-start">
                    <div className="leading-none text-sm">Nyeki.py</div>
                    <div className="text-xs text-white/50 leading-none">
                        MyAnimeList
                    </div>
                </div>
            </button>
            <IconButton icon={<Cog6ToothIcon className="w-6 h-6" />} />
        </div>
    );
}
