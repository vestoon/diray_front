import { User } from "@/types/user"

interface UserInfoCardProps {
  user: User
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-lg font-medium text-slate-600">
              {user.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900">{user.nickname?.split("@")[0]}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">참여 중인 나눔방</p>
            <p className="text-2xl font-bold text-blue-600">{user.joinedCommunities?.length || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">내 관심 태그</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  #{tag}
                </span>
              ))}
              {user.tags && user.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  +{user.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 