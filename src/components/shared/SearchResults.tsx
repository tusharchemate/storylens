import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

interface SearchResultsProps {
  searchPosts?: any;
  isSearchFetching: boolean;
}

const SearchResults = ({
  searchPosts,
  isSearchFetching,
}: SearchResultsProps) => {
  if (isSearchFetching) {
    return <Loader />;
  }

  if (searchPosts?.documents?.length > 0) {
    return <GridPostList posts={searchPosts?.documents} />;
  }
  return <p className="text-light-4 mt-10 text-center w-full">No Results</p>;
};

export default SearchResults;
