interface ProfileHeaderProps {
  userName?: string;
}

export function ProfileHeader({ userName }: ProfileHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-4xl font-bold">
        Selamat Datang Kembali!{" "}
        {userName && <span className="text-purple-600">{userName}</span>}
      </h1>
    </div>
  );
}
