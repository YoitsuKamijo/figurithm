import { BinarySearchAnimator } from "../graphics/algorithm_animators/BinarySearchAnimator"
import { GridSearchAnimator } from "../graphics/algorithm_animators/GridSearchAnimator"


export enum Algorithm {
    DFS = 'dfs',
    BINARY_SEARCH = 'binary search'
}

export const categoryMap = {
    'search': [Algorithm.BINARY_SEARCH, Algorithm.DFS],
    'dynamic programming': [Algorithm.BINARY_SEARCH]
}

export const animatorMap = {
    [Algorithm.DFS]: GridSearchAnimator.creator,
    [Algorithm.BINARY_SEARCH]: BinarySearchAnimator.creator
}