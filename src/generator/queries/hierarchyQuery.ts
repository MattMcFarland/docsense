import { DirectoryModel, FileIdRecord } from '../../core-plugins/directory';
import { ESModule } from '../../core-plugins/es-modules';
import { FileKind, FileModel } from '../../core-plugins/file';
import { decode, encode } from '../../utils/base64';
import Query from './Query';

const hierarchyQuery = (db: Lowdb): Promise<any[]> => {
  const { directory_collection, file_collection } = db.getState();

  /**
   * Explodes the dir_collection into a tree.
   */
  function explode(dir_collection: DirectoryModel[]): any {
    const ds = dir_collection.map(d => d.directory_id + '/');
    const ps = dir_collection.reduce((acc: string[], dirModel): string[] => {
      if (dirModel.files) {
        dirModel.files.forEach((f: FileIdRecord) => {
          const filepath = decode(f.file_id);
          acc.push(filepath);
        });
      }
      return acc;
    }, []);

    const paths = [...ds, ...ps];

    /**
     * Extract a filename from a path
     * @param dir_collection dir_collection from database
     * @author Stephane Janicaud
     * @link https://stackoverflow.com/questions/43431829/split-array-of-file-paths-into-hierarchical-object-in-javascript/43432913#43432913
     */
    function getFilename(path: string): string {
      return path
        .split('/')
        .filter(value => {
          return value && value.length;
        })
        .reverse()[0];
    }

    /**
     * Find sub paths
     * @param path
     * @author Stephane Janicaud
     * @link https://stackoverflow.com/questions/43431829/split-array-of-file-paths-into-hierarchical-object-in-javascript/43432913#43432913
     */
    function findSubPaths(path: string): string[] {
      // slashes need to be escaped when part of a regexp
      const rePath = path.replace('/', '\\/');
      const re = new RegExp('^' + rePath + '[^\\/]*\\/?$');
      return paths.filter(i => {
        return i !== path && re.test(i);
      });
    }

    /**
     * Build tree recursively
     * @param path
     * @author Stephane Janicaud
     * @link https://stackoverflow.com/questions/43431829/split-array-of-file-paths-into-hierarchical-object-in-javascript/43432913#43432913
     */
    function buildTree(path: string = ''): any {
      const nodeList: any = [];
      findSubPaths(path).forEach(subPath => {
        const nodeName = getFilename(subPath);
        if (/\/$/.test(subPath)) {
          const node: any = {};
          node[nodeName] = buildTree(subPath);
          nodeList.push(node);
        } else {
          const file_id = encode(subPath);

          const fileInfo = file_collection.find((f: any) => f.id === file_id);
          nodeList.push({ ...fileInfo });
        }
      });
      return nodeList;
    }

    // Build tree from root
    return buildTree();
  }

  return Promise.resolve(explode(directory_collection));
};

export default new Query<any[], void>(hierarchyQuery);
