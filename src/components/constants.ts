import BfsAnimator from "../graphics/algorithm_animators/BfsAnimator";
import { BinarySearchAnimator } from "../graphics/algorithm_animators/BinarySearchAnimator";
import DfsAnimator from "../graphics/algorithm_animators/DfsAnimator";
import { GridSearchAnimator } from "../graphics/algorithm_animators/GridSearchAnimator";

export enum Algorithm {
  BFS = "bfs",
  DFS = "dfs",
  BINARY_SEARCH = "binary search",
}

export const categoryMap = {
  search: [Algorithm.BINARY_SEARCH, Algorithm.BFS, Algorithm.DFS],
  "dynamic programming": [Algorithm.BINARY_SEARCH],
};

export const animatorMap = {
  [Algorithm.BFS]: BfsAnimator.creator,
  [Algorithm.DFS]: DfsAnimator.creator,
  [Algorithm.BINARY_SEARCH]: BinarySearchAnimator.creator,
};
