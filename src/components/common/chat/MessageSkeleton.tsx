import React from "react";

interface MessageSkeletonProps {
    count?: number;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({ count = 5 }) => {
    return (
        <>
            {Array(count).fill(null).map((_, index) => {
                // Alternate between left and right aligned skeletons
                const isRight = index % 2 === 0;

                return (
                    <div
                        key={index}
                        className={`flex ${isRight ? "justify-end" : "justify-start"} mb-4 animate-pulse`}
                    >
                        {!isRight && (
                            <div className="mr-2 w-8 h-8 rounded-full bg-gray-700"></div>
                        )}

                        <div className={`${isRight ? "ml-auto" : ""} w-4/5 max-w-[60%]`}>
                            <div
                                className={`rounded-lg ${isRight ? "bg-gray-800" : "bg-gray-700"
                                    }`}
                            >
                                {/* Message content skeleton */}
                                <div className="p-3">
                                    <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                    <div className="h-2 bg-gray-600 rounded w-16 mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default MessageSkeleton;