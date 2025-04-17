import { friendsList } from '~/index';
import { getUserLocale } from '@/lib/getLocale';
import localeValues from '@/locale';
import { FriendCardList } from '@/components/modules/friends/FriendsCardList';

export default function Friends() {
  const lang = getUserLocale();
  const friendsLocale = localeValues[lang].friends;

  return (
    <div>
      <header className="prose prose-p:my-2 font-mono">
        <h2>{friendsLocale.friends}</h2>
        <h3>{friendsLocale.quote}</h3>
      </header>

      <main className="mt-10 flex w-full flex-col">
        <FriendCardList data={friendsList} />
      </main>
    </div>
  );
}
